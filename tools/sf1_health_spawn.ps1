param([int]$Port = 3000, [int]$TimeoutSec = 20)
$ErrorActionPreference = "Stop"

function Wait-Port([int]$port, [int]$timeoutSec){
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while($sw.Elapsed.TotalSeconds -lt $timeoutSec){
    try{
      $c = New-Object System.Net.Sockets.TcpClient
      $iar = $c.BeginConnect('127.0.0.1',$port,$null,$null)
      if($iar.AsyncWaitHandle.WaitOne(500) -and $c.Connected){ $c.Close(); return $true }
      $c.Close()
    } catch {}
    Start-Sleep -Milliseconds 300
  }
  return $false
}

$env:PORT = "$Port"
$p = Start-Process node -ArgumentList 'server.js' -PassThru
try{
  if(-not (Wait-Port $Port $TimeoutSec)){ throw "Port $Port wurde nicht erreichbar" }
  & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'sf1_health.ps1') -Port $Port
  exit $LASTEXITCODE
} finally {
  try{ Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
}
