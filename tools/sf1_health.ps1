param([int]$Port = 3000)
$ErrorActionPreference = "Stop"

function Test-Url($u){
  try{
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
    if($r.StatusCode -eq 200){ return $true } else { return $false }
  } catch { return $false }
}

$base = "http://127.0.0.1:$Port"
$paths = @('/health','/api/ping','/')

foreach($p in $paths){
  $u = $base + $p
  if(Test-Url $u){ Write-Host "[HEALTH] 200 $p"; exit 0 }
}
Write-Error "Keine 200-Antwort auf Pfade: $($paths -join ', ') bei $base"
