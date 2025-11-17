$ErrorActionPreference="Stop"; $ProgressPreference="SilentlyContinue"

# --- Input ---
if (-not (Test-Path .\out\routes\harvest_results.json)) { throw "Fehlt: out\routes\harvest_results.json" }
$H = Get-Content .\out\routes\harvest_results.json -Raw | ConvertFrom-Json

# --- Targets bauen ---
$targets = @()

# Shopify
$shopify = $H | Where-Object { $_.Status -eq 200 -and $_.URL -like '*products.json*' } | Select-Object -ExpandProperty URL -Unique
foreach($u in $shopify){ $targets += [pscustomobject]@{ Kind='shopify'; URL=$u; HostName=([Uri]$u).Host } }

# Woo Store (erzwinge /wc/store/products je Host)
$storeBases = $H | Where-Object { $_.Status -eq 200 -and $_.URL -match '/wc/store/' } |
  ForEach-Object { try { [Uri]$_.URL } catch {} } |
  ForEach-Object { "{0}://{1}/wp-json/wc/store/products" -f $_.Scheme,$_.Host } | Sort-Object -Unique
foreach($u in $storeBases){ $targets += [pscustomobject]@{ Kind='wc_store'; URL=$u; HostName=([Uri]$u).Host } }

# WP CPT product
$wpProducts = $H | Where-Object { $_.Status -eq 200 -and $_.URL -match '/wp/v2/product([/?]|$)' } |
  Select-Object -ExpandProperty URL -Unique | ForEach-Object { $_ -replace '\?.*$','' }
foreach($u in $wpProducts){ $targets += [pscustomobject]@{ Kind='wp_product'; URL=$u; HostName=([Uri]$u).Host } }

# De-dupe
$targets = $targets | Sort-Object URL -Unique

# --- HTTP ---
Add-Type -AssemblyName System.Net.Http
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$h=[System.Net.Http.HttpClientHandler]::new(); $h.AllowAutoRedirect=$true
$c=[System.Net.Http.HttpClient]::new($h)
$c.Timeout=[TimeSpan]::FromSeconds(20)
$c.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36")
$c.DefaultRequestHeaders.Accept.ParseAdd("application/json, text/plain, */*")
$c.DefaultRequestHeaders.AcceptLanguage.ParseAdd("de-DE,de;q=0.9,en;q=0.8")

# --- Helpers ---
function Add-Q([string]$u,[string]$q){
  if([string]::IsNullOrWhiteSpace($u)){ return $q }
  if ($u -match '\?') { return ($u + '&' + $q) } else { return ($u + '?' + $q) }
}
function Get-Json([string]$url){
  $status=0; $txt=""; $json=$null
  try { $resp=$c.GetAsync($url).Result; $status=[int]$resp.StatusCode; $txt=$resp.Content.ReadAsStringAsync().Result } catch {}
  if (-not $txt) {
    try { $wr=Invoke-WebRequest -UseBasicParsing -TimeoutSec 20 -Uri $url; if($wr.StatusCode){$status=[int]$wr.StatusCode}; $txt=$wr.Content } catch {}
  }
  if ($txt) { try { $json = $txt | ConvertFrom-Json -ErrorAction Stop } catch {} }
  return @{ ok = ($null -ne $json); status=$status; len=($txt?.Length -as [int]); json=$json; text=$txt }
}
function Get-PropDeep([object]$obj,[string]$path){
  if($null -eq $obj){return $null}; $cur=$obj
  foreach($seg in $path.Split('.')){ if($null -eq $cur){return $null}; $p=$cur.PSObject.Properties[$seg]; if($p){$cur=$p.Value}else{return $null} }
  return $cur
}
function FirstNN([string[]]$paths,[object]$obj){ foreach ($p in $paths){ $v=Get-PropDeep $obj $p; if($null -ne $v -and $v -ne ""){ return $v } }; $null }
function AsText($v){ if($null -eq $v){""} elseif($v -is [string]){$v} else { ($v|ConvertTo-Json -Depth 3) } }
function Log([string]$msg){ ("[{0}] {1}" -f (Get-Date -Format s), $msg) | Add-Content -Path $log -Encoding UTF8 }

# --- Output + Debug ---
New-Item -ItemType Directory -Path .\out\normalized -Force | Out-Null
$csv = ".\out\normalized\normalized.csv"
$json= ".\out\normalized\normalized.json"
$tcsv= ".\out\normalized\targets.csv"
$log = ".\out\normalized\debug.log"
Remove-Item $csv,$json,$tcsv,$log -Force -ErrorAction SilentlyContinue
$targets | Export-Csv $tcsv -NoTypeInformation -Encoding UTF8

# --- Harvest ---
$rows=@()
$WP_PAGE_SIZE=50; $WP_MAX_PAGES=3; $SHOPIFY_LIMIT=250

foreach($t in $targets){
  $u0=[string]$t.URL; if([string]::IsNullOrWhiteSpace($u0)){ continue }
  $u = $u0 -replace '([?&])per_page=1(&|$)','$1' -replace '[?&]$',''
  $hostName=[string]$t.HostName

  Log ("TRY {0} {1} {2}" -f $t.Kind, $hostName, $u)
  $items=@()

  switch ($t.Kind) {
    'shopify' {
      $fetch = Add-Q $u ("limit={0}" -f $SHOPIFY_LIMIT)
      $r = Get-Json $fetch
      if ($r.ok -and $r.json.PSObject.Properties.Name -contains 'products') { $items = @($r.json.products) }
      else { Log ("NO-ITEMS status={0} len={1} url={2}" -f $r.status,$r.len,$fetch) }
    }
    'wc_store' {
      $hadAny=$false
      for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
        $fetch = Add-Q $u ("per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
        $r = Get-Json $fetch
        if($r.ok -and $r.json -is [System.Collections.IEnumerable] -and $r.json.Count -gt 0){
          $items += $r.json; $hadAny=$true; if($r.json.Count -lt $WP_PAGE_SIZE){ break }
        } else { if(-not $hadAny){ Log ("WC_STORE EMPTY status={0} len={1} url={2}" -f $r.status,$r.len,$fetch) }; break }
      }
      if($items.Count -eq 0){
        $base = ("{0}://{1}" -f ([Uri]$u).Scheme, ([Uri]$u).Host)
        $wp2  = "$base/wp-json/wp/v2/product"
        for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
          $fetch = Add-Q $wp2 ("per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
          $r = Get-Json $fetch
          if($r.ok -and $r.json -is [System.Collections.IEnumerable] -and $r.json.Count -gt 0){
            $items += $r.json; if($r.json.Count -lt $WP_PAGE_SIZE){ break }
          } else { break }
        }
      }
    }
    'wp_product' {
      for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
        $fetch = Add-Q $u ("per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
        $r = Get-Json $fetch
        if($r.ok -and $r.json -is [System.Collections.IEnumerable] -and $r.json.Count -gt 0){
          $items += $r.json; if($r.json.Count -lt $WP_PAGE_SIZE){ break }
        } else { break }
      }
    }
  }

  Log ("FOUND {0} items for {1}" -f $items.Count, $hostName)

  foreach($it in $items){
    $type = if($t.Kind -eq 'shopify'){'shopify_product'}
            elseif($t.Kind -eq 'wc_store'){'wc_store_product'}
            elseif($t.Kind -eq 'wp_product'){'wp_product'} else{'unknown'}

    $id     = FirstNN @('id','ID','sku','handle') $it
    $title  = FirstNN @('title.rendered','title','name','handle') $it
    $slug   = FirstNN @('slug','handle') $it
    $link   = FirstNN @('permalink','permalink_url','link','url','href') $it
    $price  = FirstNN @('prices.price','prices.regular_price','price','regular_price','sale_price','variants.0.price') $it
    $sku    = FirstNN @('sku') $it
    $image  = FirstNN @('images.0.src','image.src','images.0.url','_embedded.wp:featuredmedia.0.source_url') $it
    $vendor = FirstNN @('vendor','brand','_embedded.author.0.name') $it
    $updated= FirstNN @('updated_at','modified','date_modified','date') $it

    $rows += [pscustomobject]@{
      host=$hostName; source_url=$u; type=$type;
      id=AsText $id; slug=AsText $slug; title=AsText $title;
      price=AsText $price; sku=AsText $sku; link=AsText $link; image=AsText $image; vendor=AsText $vendor; updated=AsText $updated
    }
  }
}

# --- Output ---
$rows | Export-Csv .\out\normalized\normalized.csv -NoTypeInformation -Encoding UTF8
$rows | ConvertTo-Json -Depth 4 | Set-Content .\out\normalized\normalized.json -Encoding UTF8
"Rows: $($rows.Count)" | Tee-Object -FilePath .\out\normalized\SUMMARY.txt
