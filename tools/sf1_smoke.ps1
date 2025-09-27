param(
  [int]$BackendPort = 3000,
  [int]$FrontendPort = 3001,
  [string]$BackendUrl,
  [string]$FrontendUrl,
  [int]$TimeoutSec = 40
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Info($m){ Write-Host "[SMOKE] $m" }
function Kill-ByPort([int]$port){
  try{
    $pids = netstat -ano | Select-String -Pattern "LISTENING\s+$port`b" | ForEach-Object {
      ($_ -split '\s+')[-1]
    } | Sort-Object -Unique
    foreach($pid in $pids){
      try { Stop-Process -Id [int]$pid -Force -ErrorAction SilentlyContinue } catch {}
    }
  } catch {}
}
function Wait-Port([string]$hn, [int]$port, [int]$timeoutSec){
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while($sw.Elapsed.TotalSeconds -lt $timeoutSec){
    try{
      $c = New-Object System.Net.Sockets.TcpClient
      $iar = $c.BeginConnect($hn,$port,$null,$null)
      if($iar.AsyncWaitHandle.WaitOne(1000) -and $c.Connected){ $c.Close(); return $true }
      $c.Close()
    } catch {}
    Start-Sleep -Milliseconds 500
  }
  return $false
}
function Get-Pkg(){ (Get-Content package.json -Raw | ConvertFrom-Json) }

# Auto-Detection
$pkg = Get-Pkg
$hasServerJs = Test-Path (Join-Path $PWD 'server.js')
$hasNextDep  = ($pkg.dependencies.PSObject.Properties.Name -contains 'next') -or
               ($pkg.devDependencies.PSObject.Properties.Name -contains 'next')
$hasNextDevScript = ($pkg.scripts.PSObject.Properties.Name -contains 'dev') -and ($pkg.scripts.dev -match 'next\s+dev')

if(-not $BackendUrl){ $BackendUrl = "http://127.0.0.1:$BackendPort" }
if(-not $FrontendUrl){ $FrontendUrl = "http://127.0.0.1:$FrontendPort" }

# Self-Heal Ports
Write-Info "Self-Heal: räume Ports $BackendPort/$FrontendPort"
Kill-ByPort $BackendPort
Kill-ByPort $FrontendPort

# node_modules
if(-not (Test-Path node_modules)){
  Write-Info "node_modules fehlt → npm ci/install"
  if(Test-Path package-lock.json){ npm ci } else { npm install }
}

# Build wenn verfügbar und next vorhanden
if($hasNextDep -and ($pkg.scripts.PSObject.Properties.Name -contains 'build')){
  Write-Info "Baue Projekt: npm run build"
  npm run build
}

# Starten
$procs = @()

if($hasServerJs){
  Write-Info "Starte Backend: node server.js auf Port $BackendPort"
  $env:PORT = "$BackendPort"
  $p = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
  $procs += @{ Name="backend"; PID=$p.Id }
}

if($hasNextDep -and $hasNextDevScript){
  Write-Info "Starte Frontend: npx next dev -p $FrontendPort"
  $p2 = Start-Process -FilePath "npx" -ArgumentList "next","dev","-p","$FrontendPort" -PassThru -WindowStyle Hidden
  $procs += @{ Name="frontend"; PID=$p2.Id }
} else {
  Write-Info "Frontend wird übersprungen (Next.js nicht installiert oder kein next dev-Script)."
}

# Warten auf Ports
if($hasServerJs){
  if(-not (Wait-Port '127.0.0.1' $BackendPort $TimeoutSec)){
    throw "Backend-Port $BackendPort wurde nicht erreichbar."
  }
}
if($procs.Name -contains 'frontend'){
  if(-not (Wait-Port '127.0.0.1' $FrontendPort $TimeoutSec)){
    throw "Frontend-Port $FrontendPort wurde nicht erreichbar."
  }
}

# HTTP Checks
function Assert-200($url){
  Write-Info "HTTP-Check: $url"
  try{
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
    if($r.StatusCode -ne 200){ throw "HTTP $($r.StatusCode)" }
  } catch {
    throw "Fehler bei $url : $($_.Exception.Message)"
  }
}

# Backend check
if($hasServerJs){
  $ok = $false
  foreach($path in @("/api/ping","/")){
    try { Assert-200 ($BackendUrl + $path); $ok = $true; break } catch { Write-Info $_ }
  }
  if(-not $ok){ throw "Backend-Endpoint nicht erreichbar." }
}

# Frontend check
if($procs.Name -contains 'frontend'){
  Assert-200 $FrontendUrl
}

Write-Host "[SMOKE] OK: Backend=$hasServerJs Frontend=$($procs.Name -contains 'frontend')" -ForegroundColor Green
foreach($h in $procs){ try{ Stop-Process -Id $h.PID -Force -ErrorAction SilentlyContinue } catch {} }
exit 0

trap {
  Write-Host "[SMOKE] FEHLER: $($_.Exception.Message)" -ForegroundColor Red
  foreach($h in $procs){ try{ Stop-Process -Id $h.PID -Force -ErrorAction SilentlyContinue } catch {} }
  exit 1
}
