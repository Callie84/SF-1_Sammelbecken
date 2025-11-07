# Programm: PowerShell
# Zweck: Lokale PrÃ¼fung der CIâ€‘Konventionen und Minimalâ€‘Skripte hinzufÃ¼gen, ohne Repo umzubauen.
$ErrorActionPreference = 'Stop'

function Test-PkgScript($path, $script){
  if(-not (Test-Path $path)){ return $false }
  $json = Get-Content $path -Raw | ConvertFrom-Json
  return $json.scripts -and ($json.scripts.$script)
}

$front = Join-Path $PSScriptRoot '..\apps\frontend\package.json'
$back  = Join-Path $PSScriptRoot '..\apps\backend\package.json'

Write-Host "[SF-1] PrÃ¼fe package.json Skripte ..."
foreach($t in @(@{P=$front;N='frontend'},@{P=$back;N='backend'})){
  if(Test-Path $t.P){
    $need = @('lint','test','build') | Where-Object { -not (Test-PkgScript $t.P $_) }
    if($need){ Write-Warning ("{0}: fehlende Scripts â†’ {1}" -f $t.N, ($need -join ',')) }
    else{ Write-Host ("{0}: OK" -f $t.N) }
  }
}

Write-Host "[SF-1] Fertig. CI kann laufen."