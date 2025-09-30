param(
  [string]$Root = (Split-Path -Parent $MyInvocation.MyCommand.Path),
  [switch]$Frontend
)

$ErrorActionPreference = "Stop"
function Info($m){ Write-Host "[INFO] $m" }
function Warn($m){ Write-Warning $m }
function Fail($m){ Write-Host "[FAIL] $m" -ForegroundColor Red }

function Test-SemVerGE([string]$have,[string]$need){
  $h = ($have -replace '[^\d\.]').Split('.'); $n = $need.Split('.')
  while($h.Count -lt 3){ $h += '0' }; while($n.Count -lt 3){ $n += '0' }
  for($i=0;$i -lt 3;$i++){ if([int]$h[$i] -gt [int]$n[$i]){return $true}; if([int]$h[$i] -lt [int]$n[$i]){return $false} }
  return $true
}

function Ensure-Node(){
  $v = (node -v) 2>$null; if(-not $v){ Fail "Node nicht gefunden"; throw "Node fehlt" }
  $ver = $v.TrimStart('v'); if(-not (Test-SemVerGE $ver '20.0.0')){ throw "Node $ver < 20" }
  Info "Node.js $ver ok"
}
function Ensure-Mongo(){
  $svc = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
  try{ $out = (mongod --version) 2>$null; if($out){ $ver = ($out|Select-String "db version v").ToString().Split()[-1].TrimStart('v'); Info "MongoDB $ver erkannt" } }catch{}
  if($svc -and $svc.Status -ne 'Running'){ Info "Starte MongoDB…"; Start-Service MongoDB; Start-Sleep 3 }
  if($svc){ Info "MongoDB Dienst: $((Get-Service MongoDB).Status)" }
}

function NpmInstall($dir){
  Info "Installiere Dependencies in $dir"
  Push-Location $dir
  try{ if(Test-Path package-lock.json){ npm ci } else { npm install } } finally { Pop-Location }
}

function Read-PackageJson($dir){
  $pkg = Join-Path $dir "package.json"
  if(Test-Path $pkg){ Get-Content $pkg -Raw | ConvertFrom-Json } else { $null }
}

function Get-NpmArgs($dir){
  $pkg = Read-PackageJson $dir
  if($pkg -and $pkg.scripts){
    if($pkg.scripts.dev){ return @('run','dev') }
    if($pkg.scripts.start){ return @('start') }
  }
  # Fallback: node server.js
  return @('exec','--','node','server.js')
}

function Start-Proc($dir,[string[]]$ArgList){
  if(-not $ArgList -or $ArgList.Count -eq 0){ throw "ArgList leer" }
  Start-Process -FilePath "npm" -ArgumentList $ArgList -WorkingDirectory $dir -WindowStyle Minimized -PassThru
}

function Wait-HttpOk($url,[int]$tries=40,[int]$delayMs=500){
  for($i=1;$i -le $tries; $i++){
    try{
      $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
      if($r.StatusCode -ge 200 -and $r.StatusCode -lt 300){ return $true }
    } catch {}
    Start-Sleep -Milliseconds $delayMs
  }
  return $false
}

function Apply(){
  Ensure-Node
  Ensure-Mongo

  # Backend
  NpmInstall $Root
  $backendArgs = Get-NpmArgs $Root
  Info ("Starte Backend (npm {0})…" -f ($backendArgs -join ' '))
  $global:BackendProc = Start-Proc $Root $backendArgs

  # Optional Frontend
  if($Frontend){
    $fe = Join-Path $Root "apps\frontend"
    if(Test-Path (Join-Path $fe "package.json")){
      NpmInstall $fe
      $feArgs = Get-NpmArgs $fe
      Info ("Starte Frontend (npm {0})…" -f ($feArgs -join ' '))
      $global:FrontendProc = Start-Proc $fe $feArgs
    } else {
      Warn "apps/frontend nicht gefunden. Frontend wird übersprungen."
    }
  }
}

function Verify(){
  [pscustomobject]@{
    Ping   = (Wait-HttpOk "http://localhost:3000/api/ping")
    Prices = (Wait-HttpOk "http://localhost:3000/api/prices")
  }
}

function Heal(){
  $res = Verify
  if($res.Ping -and $res.Prices){ return $res }
  Warn "Self-Healing: Warte 5s und prüfe erneut…"; Start-Sleep 5
  $res2 = Verify
  if($res2.Ping -and $res2.Prices){ return $res2 }
  try{
    $pid = (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue).OwningProcess
    if($pid){ Warn "Port 3000 belegt. Beende PID $pid"; Stop-Process -Id $pid -Force; Start-Sleep 2; Apply; return (Verify) }
  } catch {}
  return $res2
}

# MAIN
Info "Arbeitsverzeichnis: $Root"
Apply
$r = Verify
if(-not ($r.Ping -and $r.Prices)){
  $r = Heal
  if(-not ($r.Ping -and $r.Prices)){ Fail "Verify fehlgeschlagen. Logs im npm-Fenster prüfen."; exit 1 }
  else { Info "Self-Healing erfolgreich" }
} else { Info "Verify ok" }

Info "Öffne /api/ping und /api/prices…"
Start-Process "http://localhost:3000/api/ping" | Out-Null
Start-Process "http://localhost:3000/api/prices" | Out-Null
if($Frontend){ Info "Hinweis: React wählt meist Port 3001." }
Info "Fertig."
