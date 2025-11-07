$ErrorActionPreference="Stop"; $ProgressPreference="SilentlyContinue"

# --- Input ---
if (-not (Test-Path .\out\routes\harvest_results.json)) { throw "Fehlt: out\routes\harvest_results.json" }
$H = Get-Content .\out\routes\harvest_results.json | ConvertFrom-Json

# --- Targets bauen ---
$targets = @()

# Shopify
$shopify = $H | Where-Object { $_.Status -eq 200 -and $_.URL -like '*products.json*' } | Select-Object -ExpandProperty URL -Unique
foreach($u in $shopify){ $targets += [pscustomobject]@{ Kind='shopify'; URL=$u; HostName=([Uri]$u).Host } }

# Woo Store: vorhandene und erzwungene
$storeExisting = $H | Where-Object { $_.Status -eq 200 -and $_.URL -match '/wc/store/products(\?|$)' } | Select-Object -ExpandProperty URL -Unique
foreach($u in $storeExisting){ $targets += [pscustomobject]@{ Kind='wc_store'; URL=($u -replace '\?.*$',''); HostName=([Uri]$u).Host } }

$storeHosts = $H | Where-Object { $_.Status -eq 200 -and $_.URL -match '/wc/store/' } |
  ForEach-Object { try { [Uri]$_.URL } catch {} } |
  ForEach-Object { "{0}://{1}" -f $_.Scheme,$_.Host } | Sort-Object -Unique
foreach($b in $storeHosts){
  $u = "$b/wp-json/wc/store/products"
  if(-not ($targets | Where-Object URL -eq $u)){ $targets += [pscustomobject]@{ Kind='wc_store'; URL=$u; HostName=([Uri]$u).Host } }
}

# WP CPT product
$wpProducts = $H | Where-Object { $_.Status -eq 200 -and $_.URL -match '/wp/v2/product([/?]|$)' } | Select-Object -ExpandProperty URL -Unique
foreach($u in $wpProducts){ $targets += [pscustomobject]@{ Kind='wp_product'; URL=($u -replace '\?.*$',''); HostName=([Uri]$u).Host } }

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

function Get-Json([string]$url){
  try { ($c.GetStringAsync($url).Result) | ConvertFrom-Json -ErrorAction Stop } catch { $null }
}
function Add-Q([string]$u,[string]$q){ if ($u -match '\?') { "$u&$q" } else { "$u?$q" } }
function Get-PropDeep([object]$obj,[string]$path){
  if($null -eq $obj){return $null}; $cur=$obj
  foreach($seg in $path.Split('.')){ if($null -eq $cur){return $null}; $p=$cur.PSObject.Properties[$seg]; if($p){$cur=$p.Value}else{return $null} }
  return $cur
}
function FirstNN([string[]]$paths,[object]$obj){ foreach ($p in $paths){ $v=Get-PropDeep $obj $p; if($null -ne $v -and $v -ne ""){ return $v } }; $null }
function AsText($v){ if($null -eq $v){""} elseif($v -is [string]){$v} else { ($v|ConvertTo-Json -Depth 3) } }

# --- Output + Debug ---
New-Item -ItemType Directory -Path .\out\normalized -Force | Out-Null
$csv = ".\out\normalized\normalized.csv"
$json= ".\out\normalized\normalized.json"
$tcsv= ".\out\normalized\targets.csv"
$log = ".\out\normalized\debug.log"
Remove-Item $csv,$json,$tcsv,$log -Force -ErrorAction SilentlyContinue
$targets | Export-Csv $tcsv -NoTypeInformation -Encoding UTF8

function Log([string]$msg){ ("[{0}] {1}" -f (Get-Date -Format s), $msg) | Add-Content -Path $log -Encoding UTF8 }

$rows=@()
$WP_PAGE_SIZE=50; $WP_MAX_PAGES=3; $SHOPIFY_LIMIT=250

foreach($t in $targets){
  $u0=[string]$t.URL
  $hostName=[string]$t.HostName
  if([string]::IsNullOrWhiteSpace($u0)){ continue }
  $u = $u0 -replace '([?&])per_page=1(&|$)','$1' -replace '[?&]$',''

  Log ("TRY {0} {1} {2}" -f $t.Kind, $hostName, $u)
  $items=@()

  switch ($t.Kind) {
    'shopify' {
      $fetch = Add-Q $u ("limit={0}" -f $SHOPIFY_LIMIT)
      $j = Get-Json $fetch
      if ($j -and ($j.PSObject.Properties.Name -contains 'products')) { $items = @($j.products) }
    }
    'wc_store' {
      for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
        $fetch = Add-Q $u ("per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
        $arr = Get-Json $fetch
        if($arr -is [System.Collections.IEnumerable] -and $arr.Count -gt 0){
          $items += $arr; if($arr.Count -lt $WP_PAGE_SIZE){ break }
        } else { break }
      }
      # Fallback 1: sichtbare Katalogeinträge
      if($items.Count -eq 0){
        for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
          $fetch = Add-Q $u ("catalog_visibility=visible&per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
          $arr = Get-Json $fetch
          if($arr -is [System.Collections.IEnumerable] -and $arr.Count -gt 0){
            $items += $arr; if($arr.Count -lt $WP_PAGE_SIZE){ break }
          } else { break }
        }
      }
      # Fallback 2: WP CPT products (manche Seiten geben dort frei)
      if($items.Count -eq 0){
        $base = ("{0}://{1}" -f ([Uri]$u).Scheme, ([Uri]$u).Host)
        $wp2 = "$base/wp-json/wp/v2/product"
        for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
          $fetch = Add-Q $wp2 ("per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
          $arr = Get-Json $fetch
          if($arr -is [System.Collections.IEnumerable] -and $arr.Count -gt 0){
            $items += $arr; if($arr.Count -lt $WP_PAGE_SIZE){ break }
          } else { break }
        }
      }
    }
    'wp_product' {
      for($pg=1; $pg -le $WP_MAX_PAGES; $pg++){
        $fetch = Add-Q $u ("per_page={0}&page={1}" -f $WP_PAGE_SIZE,$pg)
        $arr = Get-Json $fetch
        if($arr -is [System.Collections.IEnumerable] -and $arr.Count -gt 0){
          $items += $arr; if($arr.Count -lt $WP_PAGE_SIZE){ break }
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
$rows | Export-Csv $csv -NoTypeInformation -Encoding UTF8
$rows | ConvertTo-Json -Depth 4 | Set-Content $json -Encoding UTF8
"Rows: $($rows.Count)" | Tee-Object -FilePath .\out\normalized\SUMMARY.txt
