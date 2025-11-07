$ErrorActionPreference="Stop"; $ProgressPreference="SilentlyContinue"

# --- Pfade (absolut) ---
$ROOT   = (Get-Location).Path
$OUT    = (Resolve-Path ".\out\normalized").Path
$ZIP    = Join-Path $OUT 'sf1_app_bundle.zip'
$NRDY   = Join-Path $OUT 'normalized_ready.csv'

# --- Helpers ---
function ToD($s){ if($null -eq $s -or "$s" -eq ''){return [double]::NaN}; $x="$s" -replace ',','.'; try{[double]$x}catch{[double]::NaN} }
function HtmlDecode($s){ [System.Net.WebUtility]::HtmlDecode("$s") }
function NormTitle($s){ ($s|HtmlDecode).ToLower() -replace '\s+',' ' -replace '[^\p{L}\p{Nd}\s]+','' -replace '\s+',' ' }
function Bucket([double]$p){ if($p -lt 5){'0-5'} elseif($p -lt 10){'5-10'} elseif($p -lt 20){'10-20'} elseif($p -lt 50){'20-50'} elseif($p -lt 100){'50-100'} else{'100+'} }

# Heuristiken
$ALLOW = '(seed|semilla|semillas|fem|feminized|regular|auto( |-|$)|autoflower|photoperiod|indica|sativa|hybrid|haze|skunk|kush)'
$BLOCK = '(pre\s*-?\s*roll|paper|clipper|lighter|shirt|hoodie|cap|merch|sticker|tray|grinder|nutrient|starter\s*kit)'

# --- Eingang prüfen ---
if (!(Test-Path $NRDY)) { throw "Fehlt: $NRDY (erst normalize.ps1 laufen lassen)" }

# --- Laden & filtern ---
$ready = Import-Csv $NRDY
$final = $ready | Where-Object {
  $_.type -in @('wc_store_product','shopify_product') -and
  -not [double]::IsNaN( (ToD $_.price_norm) ) -and
  (ToD $_.price_norm) -gt 0
}

# De-Dupe nach Host+Link
$dedup = $final | Sort-Object host,link -Unique

# Seeds-only
$seeds = $dedup | ForEach-Object {
  $t = HtmlDecode $_.title
  [pscustomobject]@{title=$t; title_clean=$t.ToLower(); host=$_.host; link=$_.link; image=$_.image; vendor=$_.vendor; source_url=$_.source_url; type=$_.type; id=$_.id; slug=$_.slug; price_norm=$_.price_norm}
} | Where-Object {
  $_.title_clean -match $ALLOW -and $_.title_clean -notmatch $BLOCK -and $_.link -match '^https?://'
}

# --- Exporte Basis ---
$P_SEEDS          = Join-Path $OUT 'products_seeds_only.csv'
$P_FEED           = Join-Path $OUT 'feed_seeds_clean.csv'
$P_SECT           = Join-Path $OUT 'sections_cheapest5_per_host.json'
$P_HOSTS_OV       = Join-Path $OUT 'hosts_overview.json'
$P_DEDUP_TITLE    = Join-Path $OUT 'seeds_dedup_by_title.csv'
$P_HOST_STATS_DD  = Join-Path $OUT 'host_price_stats_dedup.csv'
$P_BUCKETS_HOST   = Join-Path $OUT 'price_buckets_by_host.csv'
$P_BUCKETS_GLOBAL = Join-Path $OUT 'price_buckets_global.csv'
$P_CHEAPEST1      = Join-Path $OUT 'cheapest1_per_host.csv'
$P_CHEAPEST5      = Join-Path $OUT 'cheapest5_per_host.csv'
$P_BADLINKS       = Join-Path $OUT 'bad_links.csv'
$P_INDEX          = Join-Path $OUT 'search_index.jsonl'
$P_DELTA_NEW      = Join-Path $OUT 'delta_new_items.csv'
$P_DELTA_PRICE    = Join-Path $OUT 'delta_price_changes.csv'
$P_MANIFEST       = Join-Path $OUT 'manifest.json'

# Seeds speichern
$seeds | Export-Csv $P_SEEDS -NoTypeInformation -Encoding UTF8

# Feed (dezimalpunkt, HTML-decoded)
$feed = $seeds | Select-Object host,
  @{n='title';e={$_.title}},
  @{n='price';e={ $p=ToD $_.price_norm; if([double]::IsNaN($p)){ '' } else { [string]([math]::Round($p,2)) } }},
  link,image,vendor,source_url,type,id,slug
$feed | Export-Csv $P_FEED -NoTypeInformation -Encoding UTF8

# Sections: cheapest 5 per host
$sections = foreach($g in ($seeds | Sort-Object host,@{e={ ToD $_.price_norm }} | Group-Object host)){
  [pscustomobject]@{
    title = "Cheapest at " + $g.Name
    host  = $g.Name
    items = @(
      $g.Group | Select-Object -First 5 `
        @{n='title';e={ $_.title }}, `
        @{n='price';e={ [math]::Round((ToD $_.price_norm),2) }}, `
        link, image
    )
  }
}
$sections | ConvertTo-Json -Depth 5 | Set-Content $P_SECT -Encoding UTF8

# Hosts overview (n, min/median/avg/max)
$stats = foreach($h in ($seeds.host | Select-Object -Unique)){
  $vals = $seeds | Where-Object host -eq $h | ForEach-Object { ToD $_.price_norm } | Where-Object { -not [double]::IsNaN($_) } | Sort-Object
  if($vals.Count -eq 0){ continue }
  $mid = [int][math]::Floor(($vals.Count-1)/2)
  [pscustomobject]@{
    host=$h; n=$vals.Count; min=$vals[0]; median=$vals[$mid];
    avg=[math]::Round((($vals | Measure-Object -Average).Average),2); max=$vals[-1]
  }
}
$stats | Sort-Object host | ConvertTo-Json -Depth 4 | Set-Content $P_HOSTS_OV -Encoding UTF8

# Dedup über Titel (normiert) -> best price
$norm = $seeds | Select-Object `
  @{n='title_norm';e={ NormTitle $_.title }}, `
  title, host, link, @{n='price';e={ ToD $_.price_norm }}
$bestByTitle = foreach($g in ($norm | Group-Object title_norm)){
  $valid = $g.Group | Where-Object { -not [double]::IsNaN($_.price) } | Sort-Object price
  if($valid.Count -eq 0){ continue }
  $min = $valid | Select-Object -First 1
  [pscustomobject]@{
    title_norm=$g.Name; title=$min.title; host=$min.host; link=$min.link; price=$min.price;
    hosts = ($g.Group.host | Select-Object -Unique) -join ','
  }
}
$bestByTitle | Export-Csv $P_DEDUP_TITLE -NoTypeInformation -Encoding UTF8

# Host-Stats (Dateiname beibehalten)
$stats | Select-Object host,n,min,median,avg,max | Export-Csv $P_HOST_STATS_DD -NoTypeInformation -Encoding UTF8

# Buckets je Host & global
$rows = $seeds | ForEach-Object { $p=ToD $_.price_norm; if(-not [double]::IsNaN($p)){ [pscustomobject]@{ host=$_.host; bucket=(Bucket $p) } } }
$rows | Group-Object host,bucket | ForEach-Object { [pscustomobject]@{ host=$_.Group[0].host; bucket=$_.Group[0].bucket; count=$_.Count } } |
  Sort-Object host,bucket | Export-Csv $P_BUCKETS_HOST -NoTypeInformation -Encoding UTF8
$rows | Group-Object bucket | Select-Object @{n='bucket';e={$_.Name}}, @{n='Count';e={$_.Count}} |
  Sort-Object bucket | Export-Csv $P_BUCKETS_GLOBAL -NoTypeInformation -Encoding UTF8

# Cheapest 1 & 5 per host (CSV)
$seeds | Sort-Object host,@{e={ ToD $_.price_norm }} | Group-Object host |
  ForEach-Object { $_.Group | Select-Object -First 1 title,@{n='price_norm';e={ ToD $_.price_norm }},host,link } |
  Export-Csv $P_CHEAPEST1 -NoTypeInformation -Encoding UTF8
$seeds | Sort-Object host,@{e={ ToD $_.price_norm }} | Group-Object host |
  ForEach-Object { $_.Group | Select-Object -First 5 title,@{n='price_norm';e={ ToD $_.price_norm }},host,link } |
  Export-Csv $P_CHEAPEST5 -NoTypeInformation -Encoding UTF8

# Bad links
$bad = $seeds | Where-Object { -not ($_.link -match '^https?://') -or [string]::IsNullOrWhiteSpace($_.link) }
$bad | Select-Object host,title,link | Export-Csv $P_BADLINKS -NoTypeInformation -Encoding UTF8

# Search-Index (JSONL)
Remove-Item $P_INDEX -Force -ErrorAction SilentlyContinue
$seeds | ForEach-Object {
  $obj = [pscustomobject]@{ t=$_.title; h=$_.host; p=[math]::Round((ToD $_.price_norm),2); l=$_.link }
  ($obj | ConvertTo-Json -Compress) | Add-Content -Path $P_INDEX -Encoding UTF8
}

# --- Deltas vs vorherigem ZIP (falls vorhanden) ---
Add-Type -AssemblyName System.IO.Compression.FileSystem
function ExtractFromZip($zip,$entry,$dest){
  if(!(Test-Path $zip)){ return $false }
  $z=[System.IO.Compression.ZipFile]::OpenRead($zip)
  try{
    $e=$z.Entries | Where-Object FullName -eq $entry | Select-Object -First 1
    if($e){ $fs=[System.IO.File]::Create($dest); $e.Open().CopyTo($fs); $fs.Dispose(); return $true } else { return $false }
  } finally { $z.Dispose() }
}
$prevFeed = Join-Path $OUT 'prev_feed.csv'
if (ExtractFromZip $ZIP 'feed_seeds_clean.csv' $prevFeed) {
  $prev = Import-Csv $prevFeed
  $curr = Import-Csv $P_FEED

  # Neue Items
  $new = Compare-Object `
    ($prev | Select-Object -Unique host,link) `
    ($curr | Select-Object -Unique host,link) `
    -Property host,link -PassThru | Where-Object SideIndicator -eq '=>'
  $new | ForEach-Object {
    $row = $curr | Where-Object { $_.host -eq $_.host -and $_.link -eq $_.link } | Select-Object -First 1
    [pscustomobject]@{ host=$row.host; title=$row.title; price=$row.price; link=$row.link }
  } | Export-Csv $P_DELTA_NEW -NoTypeInformation -Encoding UTF8

  # Preisänderungen
  $lookup = @{}; foreach($r in $prev){ $lookup[$r.host + '|' + $r.link] = $r }
  $changes = foreach($r in $curr){
    $k = $r.host + '|' + $r.link
    if($lookup.ContainsKey($k)){
      $old=$lookup[$k]; $pOld=ToD $old.price; $pNew=ToD $r.price
      if(-not [double]::IsNaN($pOld) -and -not [double]::IsNaN($pNew) -and $pOld -ne $pNew){
        [pscustomobject]@{ host=$r.host; title=$r.title; price_old=$pOld; price_new=$pNew; diff=[math]::Round(($pNew-$pOld),2); link=$r.link }
      }
    }
  }
  $changes | Export-Csv $P_DELTA_PRICE -NoTypeInformation -Encoding UTF8
} else {
  # Keine Vorgänger: leere Platzhalter
  '' | Out-File $P_DELTA_NEW  -Encoding UTF8
  '' | Out-File $P_DELTA_PRICE -Encoding UTF8
}

# --- Manifest ---
$files = @($P_SECT,$P_DEDUP_TITLE,$P_HOST_STATS_DD,$P_BADLINKS,$P_FEED,$P_HOSTS_OV,$P_INDEX,$P_DELTA_NEW,$P_DELTA_PRICE) |
  Where-Object { Test-Path $_ }
$manifest = [pscustomobject]@{
  generated = (Get-Date).ToString('s')
  items     = (Import-Csv $P_FEED).Count
  hosts     = ((Import-Csv $P_FEED).host | Select-Object -Unique).Count
  files     = ($files | ForEach-Object { Split-Path $_ -Leaf })
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content $P_MANIFEST -Encoding UTF8

# --- ZIP (Update oder Create) ---
Add-Type -AssemblyName System.IO.Compression.FileSystem
if(Test-Path $ZIP){
  $zipU = [System.IO.Compression.ZipFile]::Open($ZIP,'Update')
} else {
  $zipU = [System.IO.Compression.ZipFile]::Open($ZIP,'Create')
}
foreach($f in $files + @($P_MANIFEST)){
  $name = Split-Path $f -Leaf
  ($zipU.Entries | Where-Object FullName -eq $name) | ForEach-Object { $_.Delete() }
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipU,(Resolve-Path $f),$name) | Out-Null
}
$zipU.Dispose()

# --- Kontrolle & Hash ausgeben ---
$za=[System.IO.Compression.ZipFile]::OpenRead($ZIP)
$entries = $za.Entries | Select FullName,Length | Sort-Object FullName
$za.Dispose()
$hash = (Get-FileHash $ZIP -Algorithm SHA256).Hash

"ZIP: $ZIP"
$entries | Format-Table -Auto | Out-String | Write-Host
"SHA256: $hash"
