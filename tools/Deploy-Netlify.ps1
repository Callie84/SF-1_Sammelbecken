# Deploy-Netlify.ps1 (v2, Quoting-Fix)
param(
  [switch]$Prod,
  [switch]$Clean,
  [switch]$OnlyBuild
)

$ErrorActionPreference = "Stop"
$root     = "C:\Users\kling\Desktop\SF-1_Sammelbecken"
$frontend = Join-Path $root "apps\frontend"
$logDir   = Join-Path $root "logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Force -Path $logDir | Out-Null }
$log = Join-Path $logDir ("deploy_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Step($m){ Write-Host "[STEP] $m" -ForegroundColor Cyan;  "[STEP] $m" | Out-File $log -Append }
function Write-Ok($m){   Write-Host "[OK]   $m" -ForegroundColor Green; "[OK]   $m" | Out-File $log -Append }
function Write-Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow; "[WARN] $m" | Out-File $log -Append }
function Write-Err($m){  Write-Host "[ERR]  $m" -ForegroundColor Red;   "[ERR]  $m" | Out-File $log -Append }

function Ensure-NodeNpm {
  Write-Step "Prüfe Node/npm"
  if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Err "Node/npm fehlen. Installiere Node.js LTS."
    throw "Node/npm nicht gefunden"
  }
  Write-Ok "Node $(node -v), npm $(npm -v)"
}

function Ensure-NetlifyCLI {
  Write-Step "Prüfe Netlify CLI"
  if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Warn "Netlify CLI fehlt. Installiere global…"
    npm install -g netlify-cli | Out-Null
    if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) { throw "Netlify CLI Install fehlgeschlagen" }
  }
  Write-Ok "Netlify CLI $(netlify --version)"
}

function Ensure-Login {
  Write-Step "Prüfe Netlify-Login"
  & netlify status 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Warn "Nicht eingeloggt. Starte Login…"
    & netlify login | Out-Null
    & netlify status | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Login fehlgeschlagen" }
  }
  Write-Ok "Login ok"
}

function Clean-Install {
  if ($Clean) {
    Write-Step "Clean-Install im Frontend"
    Push-Location $frontend
    if (Test-Path "node_modules")      { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
    npm ci
    Pop-Location
    Write-Ok "Clean-Install fertig"
  }
}

function Fix-Config {
  Write-Step "Selbstheilung: package.json + netlify.toml"
  $pkgJson = Join-Path $frontend "package.json"
  if (Test-Path $pkgJson) {
    $pkg = Get-Content $pkgJson -Raw | ConvertFrom-Json
    if (-not $pkg.scripts) { $pkg | Add-Member -NotePropertyName scripts -NotePropertyValue @{} }
    if ($pkg.scripts.build -notmatch 'vite build') {
      $pkg.scripts.build = "vite build"
      ($pkg | ConvertTo-Json -Depth 100) | Set-Content -Encoding UTF8 $pkgJson
      Write-Warn "package.json: build -> vite build"
    }
  }

  $toml = Join-Path $root "netlify.toml"
  if (Test-Path $toml) {
    $content = Get-Content $toml -Raw
    # Suche publish-Zeile, ohne Backslashes escapen zu müssen
    if ($content -notmatch 'publish\s*=\s*"apps/frontend/dist"') {
      if ($content -match 'publish\s*=') {
        $content = [regex]::Replace($content,'publish\s*=\s*".*?"','publish = "apps/frontend/dist"')
      } elseif ($content -match '^\s*\[build\]') {
        $content = $content -replace '(\[build\][^\[]*)', ('$1' + "`r`npublish = ""apps/frontend/dist""")
      } else {
        $content = "[build]`r`npublish = ""apps/frontend/dist""`r`n`r`n" + $content
      }
      $content | Set-Content -Encoding UTF8 $toml
      Write-Warn "netlify.toml: publish -> apps/frontend/dist"
    }
  } else {
@"
[build]
publish = "apps/frontend/dist"
command = "npm run build"
"@ | Set-Content -Encoding UTF8 $toml
    Write-Warn "netlify.toml neu erstellt"
  }
  # Legacy-Ordner aufräumen
  $buildLegacy = Join-Path $frontend "build"
  if (Test-Path $buildLegacy) { Remove-Item -Recurse -Force $buildLegacy; Write-Warn "Legacy build/ entfernt" }
  Write-Ok "Konfig konsistent"
}

function Build-Frontend {
  Write-Step "Vite-Build starten"
  Push-Location $frontend
  npm install --no-fund --no-audit
  npm run build
  Pop-Location
  Write-Ok "Build ok"
}

function Verify-Output {
  Write-Step "Prüfe dist"
  $dist = Join-Path $frontend "dist"
  if (-not (Test-Path $dist)) { throw "dist fehlt" }
  $cnt = (Get-ChildItem -Recurse $dist | Measure-Object).Count
  if ($cnt -lt 3) { throw "dist unplausibel ($cnt Dateien)" }
  Write-Ok "dist ok ($cnt Dateien)"
  return $dist
}

function Deploy-Netlify([string]$dir) {
  if ($OnlyBuild) { Write-Warn "OnlyBuild aktiv. Deploy übersprungen."; return }
  Ensure-NetlifyCLI
  Ensure-Login
  if ($Prod) {
    Write-Step "Production-Deploy"
    & netlify deploy --prod --dir="$dir" --message "manual prod $(Get-Date -Format s)" --json | Tee-Object -FilePath $log -Append | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Prod-Deploy fehlgeschlagen" }
    Write-Ok "Prod-Deploy fertig"
  } else {
    Write-Step "Preview-Deploy"
    & netlify deploy --dir="$dir" --message "manual preview $(Get-Date -Format s)" --json | Tee-Object -FilePath $log -Append | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Preview-Deploy fehlgeschlagen" }
    Write-Ok "Preview-Deploy fertig"
  }
}

try {
  Write-Step "Pipeline startet"
  Ensure-NodeNpm
  Clean-Install
  Fix-Config
  Build-Frontend
  $out = Verify-Output
  Deploy-Netlify -dir $out
  Write-Ok "Fertig. Log: $log"
} catch {
  Write-Err ($_.Exception.Message)
  Write-Err "Abbruch. Log: $log"
  exit 1
}
