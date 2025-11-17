$ErrorActionPreference="Stop"; $ProgressPreference="SilentlyContinue"

# Input laden (candidates.json oder scan.log)
if (Test-Path .\out\candidates.json) {
  $items = Get-Content .\out\candidates.json | ConvertFrom-Json
} elseif (Test-Path .\scan.log) {
  $lines = Get-Content .\scan.log
  $start = ($lines | Select-String -SimpleMatch "Kandidaten mit JSON 200:" | Select-Object -First 1).LineNumber
  if (-not $start) { throw "Keine Kandidaten-Sektion in scan.log" }
  $entries = $lines[$start..($lines.Length-1)] | Where-Object { $_ -match '^\s*-\s' }
  $items = foreach ($e in $entries) {
    if ($e -match '^\s*-\s+(.*?):\s+(https?://\S+)\s*$') { [pscustomobject]@{ Name=$matches[1].Trim(); URL=$matches[2].Trim() } }
  }
} else { throw "Weder out\candidates.json noch scan.log vorhanden." }

# Dedupe
$seen=@{}; $items = $items | Where-Object { $u=$_.URL.ToLower(); if($seen.ContainsKey($u)){ $false } else { $seen[$u]=$true; $true } }

# HTTP
Add-Type -AssemblyName System.Net.Http
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$h=[System.Net.Http.HttpClientHandler]::new(); $h.AllowAutoRedirect=$true
$c=[System.Net.Http.HttpClient]::new($h)
$c.Timeout=[TimeSpan]::FromSeconds(8)
$c.DefaultRequestHeaders.UserAgent.ParseAdd("SF-1-seedscan/1.0")
$c.DefaultRequestHeaders.Accept.ParseAdd("application/json")
$c.DefaultRequestHeaders.AcceptLanguage.ParseAdd("de-DE,de;q=0.9,en;q=0.8")

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
        } else { $schema[$p.Name]=@{type=("array/{0}" -f $ft)} }
      } else { $schema[$p.Name]=@{type='array/empty'} }
    } else { $schema[$p.Name]=@{type=$t} }
  }
  return $schema
}
function Safe-FileName([string]$url){
  $u=[Uri]$url; $path=$u.AbsolutePath; if([string]::IsNullOrWhiteSpace($path)){ $path='_' }
  $path=$path -replace '[\\/:\*\?"<>\| ]','_'
  "{0}_{1}" -f $u.Host, $path.Trim('_')
}

# Output-Ordner
New-Item -ItemType Directory -Path .\out -Force | Out-Null
New-Item -ItemType Directory -Path .\out\snapshots -Force | Out-Null
New-Item -ItemType Directory -Path .\out\schemas -Force | Out-Null

# Scan
$results=@(); $hostAgg=@{}; $delay=0.4; $maxRetries=3
$i=0; $n=$items.Count
foreach($it in $items){
  $i++; $name=$it.Name; $url=$it.URL; $hostName=([Uri]$url).Host.ToLower()
  if(-not $hostAgg.ContainsKey($hostName)){ $hostAgg[$hostName]=[pscustomobject]@{Host=$hostName;Total=0;Ok200=0} }
  $hostAgg[$hostName].Total++
  Write-Host ("[{0}/{1}] {2}" -f $i,$n,$url)

  $ok=$false; $status=0; $ctype=""; $text=""; $err=""
  for($try=1; $try -le $maxRetries -and -not $ok; $try++){
    try{
      $r=$c.GetAsync($url).Result
      $status=[int]$r.StatusCode
      $ctype= if($r.Content.Headers.ContentType){ $r.Content.Headers.ContentType.MediaType } else { "" }
      $text=$r.Content.ReadAsStringAsync().Result
      $ok=$true
    } catch { $err=$_.Exception.Message; Start-Sleep -Seconds ([math]::Min(6, [math]::Pow(2,$try)*0.5)) }
  }

  $kind='text'; $schemaSummary=''; $sample=''
  if($ok -and $status -eq 200){
    try{
      $json = $text | ConvertFrom-Json -ErrorAction Stop
      if($json -is [System.Collections.IEnumerable] -and $json -isnot [string]){
        $kind='array'; $first=$null; foreach($e in $json){ $first=$e; break }
        if($null -ne $first){
          $ft=Get-TypeName $first
          if($ft -eq 'object'){
            $schema=Infer-ObjectSchema $first 0 2
            $schemaSummary = ($schema.Keys | ForEach-Object { '{0}:{1}' -f $_, $schema[$_].type }) -join ','
            $sample = ($first | ConvertTo-Json -Depth 3)
            ($schema | ConvertTo-Json -Depth 5) | Set-Content (".\out\schemas\{0}.schema.json" -f (Safe-FileName $url)) -Encoding UTF8
          } else { $schemaSummary = ("array/{0}" -f $ft); $sample = ($first | ConvertTo-Json -Depth 2) }
        } else { $schemaSummary='array/empty' }
      } else {
        $kind='object'
        $schema=Infer-ObjectSchema $json 0 2
        $schemaSummary = ($schema.Keys | ForEach-Object { '{0}:{1}' -f $_, $schema[$_].type }) -join ','
        $sample = ($json | ConvertTo-Json -Depth 2)
        ($schema | ConvertTo-Json -Depth 5) | Set-Content (".\out\schemas\{0}.schema.json" -f (Safe-FileName $url)) -Encoding UTF8
      }
    } catch { $kind='text' }
    try { $text | Set-Content (".\out\snapshots\{0}.json" -f (Safe-FileName $url)) -Encoding UTF8 } catch {}
    $hostAgg[$hostName].Ok200++
  }
  if($sample -and $sample.Length -gt 1500){ $sample = $sample.Substring(0,1500) }

  $results += [pscustomobject]@{Name=$name;URL=$url;Host=$hostName;Status=$status;ContentType=$ctype;Kind=$kind;Schema=$schemaSummary;Sample=$sample;Error=$err}
  Start-Sleep -Seconds $delay
}

# Reports
$results | Export-Csv .\out\endpoints_full.csv -NoTypeInformation -Encoding UTF8
$results | ConvertTo-Json -Depth 5 | Set-Content .\out\endpoints_full.json -Encoding UTF8

$hostReport = foreach($h in $hostAgg.GetEnumerator()){
  [pscustomobject]@{
    Host=$h.Value.Host; Endpoints=$h.Value.Total; OK200=$h.Value.Ok200;
    OKRate= if($h.Value.Total -gt 0){ [math]::Round(100.0*$h.Value.Ok200/$h.Value.Total,1)} else {0}
  }
}
$hostReport | Sort-Object OKRate -Descending | Export-Csv .\out\hosts_summary.csv -NoTypeInformation -Encoding UTF8

$tot=$results.Count
$okc=($results | Where-Object {$_.Status -eq 200}).Count
$schemac=(Get-ChildItem .\out\schemas -Filter *.schema.json -ErrorAction SilentlyContinue | Measure-Object).Count
$snapc=(Get-ChildItem .\out\snapshots -Filter *.json -ErrorAction SilentlyContinue | Measure-Object).Count
"Gesamt: $tot | HTTP 200: $okc | Schemas: $schemac | Snapshots: $snapc" | Tee-Object -FilePath .\out\SUMMARY.txt

