# Programm: PowerShell
# Zweck: Lokale Tests (Playwright) mit optionalen URLs
param(
  [string]$BASE_URL = "https://seedfinderpro.de",
  [string]$HEALTH_URL = "https://seedfinderpro.de/api/health"
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$tests = Join-Path $repo 'apps/tests'

$env:BASE_URL = $BASE_URL
$env:HEALTH_URL = $HEALTH_URL

if(-not (Test-Path (Join-Path $tests 'package.json'))){ throw "apps/tests nicht gefunden" }

Push-Location $tests
try {
  if(Test-Path node_modules){ Write-Host "[SF-1] npm modules vorhanden" } else { npm ci }
  npx playwright install --with-deps
  npm run test:e2e
}
finally { Pop-Location }