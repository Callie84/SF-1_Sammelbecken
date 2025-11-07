$ErrorActionPreference="Stop"; $ProgressPreference="SilentlyContinue"

# --- Input laden ---
if (-not (Test-Path .\out\endpoints_full.json)) { throw "Fehlt: .\out\endpoints_full.json. Erst fullscan.ps1 ausführen." }
$eps = Get-Content .\out\endpoints_full.json | ConvertFrom-Json
$targets = $eps | Where-Object {
  $_.Status -eq 200 -and $_.Kind -eq 'object' -and ($_.URL -match '/wp-json/?$' -or $_.URL -match '/wp-json/wp/v2/?$' -or $_.URL -match '/products\.json$')
}

# --- HTTP Client ---
Add-Type -AssemblyName System.Net.Http
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$h=[System.Net.Http.HttpClientHandler]::new(); $h.AllowAutoRedirect=$true
$c=[System.Net.Http.HttpClient]::new($h)
$c.Timeout=[TimeSpan]::FromSeconds(10)
$c.DefaultRequestHeaders.UserAgent.ParseAdd("SF-1-route-harvest/1.0")
$c.DefaultRequestHeaders.Accept.ParseAdd("application/json")
$c.DefaultRequestHeaders.AcceptLanguage.ParseAdd("de-DE,de;q=0.9,en;q=0.8")

# --- Hilfen ---
function Safe-FileName([string]$url){
  $u=[Uri]$url; $path=$u.AbsolutePath; if([string]::IsNullOrWhiteSpace($path)){ $path='_' }
  $path=$path -replace '[\\/:\*\?"<>\| ]','_'
  "{0}_{1}" -f $u.Host, $path.Trim('_')
}
function Get-TypeName([object]$v){
  if($null -eq $v){'null'}
  elseif($v -is [string]){'string'}
  elseif($v -is [bool]){'boolean'}
  elseif($v -is [int] -or $v -is [long] -or $v -is [decimal] -or $v -is [double]){'number'}
  elseif($v -is [System.Collections.IEnumerable] -and $v -isnot [string]){'array'}
  elseif($v.PSObject -ne $null){'object'} else{'unknown'}
}
function Infer-ObjectSchema([psobject]$obj,[int]$depth=0,[int]$maxDepth=2){
  $schema=@{}
  foreach($p in $obj.PSObject.Properties){
    $val=$p.Value; $t=Get-TypeName $val
    if($t -eq 'object' -and $depth -lt $maxDepth){
      $schema[$p.Name]=@{type='object'; props=(Infer-ObjectSchema $val ($depth+1) $maxDepth)}
    } elseif($t -eq 'array' -and $depth -lt $maxDepth){
      $first=$null; foreach($e in $val){ $first=$e; break }
      if($null -ne $first){
        $ft=Get-TypeName $first
        if($ft -eq 'object'){
          $schema[$p.Name]=@{type='array<object>'; props=(Infer-ObjectSchema $first ($depth+1) $maxDepth)}
        } else { $schema[$p.Name]=@{type=("array<{0}>" -f $ft)} }
      } else { $schema[$p.Name]=@{type='array<empty>'} }
    } else { $schema[$p.Name]=@{type=$t} }
  }
  return $schema
}

# --- Output Ordner ---
New-Item -ItemType Directory -Path .\out -Force | Out-Null
New-Item -ItemType Directory -Path .\out\routes -Force | Out-Null
New-Item -ItemType Directory -Path .\out\route_samples -Force | Out-Null
New-Item -ItemType Directory -Path .\out\route_schemas -Force | Out-Null

# --- Funktionen zum Ziehen von Routen ---
function Fetch-Json([string]$url){
  try {
    $r = $c.GetAsync($url).Result
    $s = [int]$r.StatusCode
    $t = if ($r.Content.Headers.ContentType) { $r.Content.Headers.ContentType.MediaType } else { "" }
    $x = $r.Content.ReadAsStringAsync().Result
    return @{ ok = $true; status=$s; ctype=$t; text=$x }
  } catch {
    return @{ ok = $false; status=0; ctype=""; text=""; err=$_.Exception.Message }
  }
}
function Parse-RoutesFromIndex([string]$baseUrl){
  $res = Fetch-Json $baseUrl
  if (-not $res.ok -or $res.status -ne 200) { return @{} }
  try {
    $json = $res.text | ConvertFrom-Json -ErrorAction Stop
    if ($json.routes) { return $json.routes }
    elseif ($json.PSObject.Properties.Name -contains 'routes') { return $json.routes }
    else { return @{} }
  } catch { return @{} }
}

# --- Kandidaten-Routen pro Host sammeln ---
$hostRoutes = @{}
foreach($t in $targets){
  $url = $t.URL
  $hostName = ([Uri]$url).Host.ToLower()

  if ($url -match '/products\.json$') {
    # Shopify: direkt als Route aufnehmen
    if (-not $hostRoutes.ContainsKey($hostName)) { $hostRoutes[$hostName] = @{} }
    $hostRoutes[$hostName]["/products.json"] = @{ full= $url; source="shopify" }
    continue
  }

  # WordPress
  $base = if ($url -match '/wp-json/wp/v2/?$') { $url -replace '/wp-json/wp/v2/?$','/wp-json/' } else { $url }
  $routes = Parse-RoutesFromIndex $base
  if ($routes.Count -eq 0) { continue }

  if (-not $hostRoutes.ContainsKey($hostName)) { $hostRoutes[$hostName] = @{} }

  foreach($k in $routes.PSObject.Properties.Name){
    # Nur GET-bare Collections mit Produktbezug oder Content-Grundtypen
    if ($k -match '^/wc/(store|v2|v3)/products' -or
        $k -match '^/wp/v2/(posts|pages|media|product|products|categories|tags)' -or
        $k -match '^/wp-json$') {
      $hostRoutes[$hostName][$k] = @{ full = ($base.TrimEnd('/') + $k); source="wp" }
    }
  }
}

# --- Routen auf Dateisystem schreiben ---
$flatRoutes = @()
foreach($hn in $hostRoutes.Keys){
  foreach($r in $hostRoutes[$hn].Keys){
    $full = $hostRoutes[$hn][$r].full
    $flatRoutes += [pscustomobject]@{ Host=$hn; Route=$r; FullUrl=$full; Source=$hostRoutes[$hn][$r].source }
  }
}
$flatRoutes | Sort-Object Host,Route | Export-Csv .\out\routes\routes_catalog.csv -NoTypeInformation -Encoding UTF8
$flatRoutes | ConvertTo-Json -Depth 5 | Set-Content .\out\routes\routes_catalog.json -Encoding UTF8

# --- Inhalte pro Route pingen, probieren, Schema ziehen ---
$delay=0.5
$harvest=@()
foreach($it in $flatRoutes){
  $u = $it.FullUrl
  # per_page=1 an Collections hängen (wenn sinnvoll)
  $u2 = if ($u -match '^https?://.*/(posts|pages|media|products)($|[?])') {
          if ($u -match '\?') { $u + '&per_page=1' } else { $u + '?per_page=1' }
        } else { $u }

  Write-Host ("FETCH {0}" -f $u2)
  $res = Fetch-Json $u2
  $kind='text'; $schema=''; $sample=''

  if ($res.ok -and $res.status -eq 200) {
    try {
      $j = $res.text | ConvertFrom-Json -ErrorAction Stop
      if ($j -is [System.Collections.IEnumerable] -and $j -isnot [string]) {
        $kind='array'
        $first=$null; foreach($e in $j){ $first=$e; break }
        if ($null -ne $first) {
          $ft = Get-TypeName $first
          if ($ft -eq 'object') {
            $sc = Infer-ObjectSchema $first 0 2
            $schema = ($sc.Keys | ForEach-Object { '{0}:{1}' -f $_, $sc[$_].type }) -join ','
            $sample = ($first | ConvertTo-Json -Depth 3)
            ($sc | ConvertTo-Json -Depth 5) | Set-Content (".\out\route_schemas\{0}.schema.json" -f (Safe-FileName $u)) -Encoding UTF8
          } else {
            $schema = ("array<{0}>" -f $ft)
            $sample = ($first | ConvertTo-Json -Depth 2)
          }
        } else { $schema='array<empty>' }
      } else {
        $kind='object'
        $sc = Infer-ObjectSchema $j 0 2
        $schema = ($sc.Keys | ForEach-Object { '{0}:{1}' -f $_, $sc[$_].type }) -join ','
        $sample = ($j | ConvertTo-Json -Depth 2)
        ($sc | ConvertTo-Json -Depth 5) | Set-Content (".\out\route_schemas\{0}.schema.json" -f (Safe-FileName $u)) -Encoding UTF8
      }
    } catch { $kind='text' }
    try { $res.text | Set-Content (".\out\route_samples\{0}.json" -f (Safe-FileName $u)) -Encoding UTF8 } catch {}
  }

  if ($sample -and $sample.Length -gt 1500){ $sample=$sample.Substring(0,1500) }

  $harvest += [pscustomobject]@{
    Host=$it.Host; Route=$it.Route; URL=$u2; Status=$res.status; ContentType=$res.ctype; Kind=$kind; Schema=$schema; Sample=$sample
  }
  Start-Sleep -Seconds $delay
}

$harvest | Export-Csv .\out\routes\harvest_results.csv -NoTypeInformation -Encoding UTF8
$harvest | ConvertTo-Json -Depth 5 | Set-Content .\out\routes\harvest_results.json -Encoding UTF8

# Kurzzusammenfassung
$tot=$harvest.Count
$ok=($harvest | Where-Object {$_.Status -eq 200}).Count
"Routes gesamt: {0} | HTTP 200: {1}" -f $tot,$ok | Tee-Object -FilePath .\out\routes\SUMMARY.txt

