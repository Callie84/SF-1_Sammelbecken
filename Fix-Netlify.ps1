param(
  [int]$MaxHeal = 3,
  [string]$NodeVersion = "20.18.1"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Write-Info([string]$m){ Write-Host "[INFO] $m" }
function Write-Warn([string]$m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Write-Err ([string]$m){ Write-Host "[FAIL] $m" -ForegroundColor Red }

function Read-Json([string]$path){
  if(!(Test-Path $path)){ return $null }
  try { Get-Content $path -Raw | ConvertFrom-Json } catch { return $null }
}

function Save-TextLF([string]$path, [string]$text){
  $lf = $text -replace "`r`n","`n"
  [System.IO.File]::WriteAllText($path, $lf, [System.Text.UTF8Encoding]::new($false))
}

function Save-Json([object]$obj, [string]$path){
  $json = $obj | ConvertTo-Json -Depth 30
  Save-TextLF -path $path -text $json
}

function Ensure-Dir([string]$p){
  if(!(Test-Path $p)){ New-Item -ItemType Directory -Path $p | Out-Null }
}

function Has-Dep($pkg, [string]$name){
  if($null -eq $pkg){ return $false }
  $has = $false
  if($pkg.PSObject.Properties['dependencifunction Detect-Framework($pkg){
  if(Has-Dep $pkg "next"){ return "next" }
  if(Has-Dep $pkg "vite"){ return "vite" }
  if(Has-Dep $pkg "react-scripts"){ return "cra" }
  if(Has-Dep $pkg "astro"){ return "astro" }
  if(Has-Dep $pkg "gatsby"){ return "gatsby" }
  if(Has-Dep $pkg "@sveltejs/kit"){ return "sveltekit" }
  return "unknown"
}

function Ensure-Dependencies([string]$fw){
  $add = @()
  switch($fw){
    "next" { $add += "@netlify/plugin-nextjs" }
    "vite" { if(-not (Get-Command vite -ErrorAction SilentlyContinue)) { $add += "vite" } }
    default { }
  }
  if($add.Count -gt 0){
    Write-Info "Installiere fehlende Pakete: $($add -join ', ')"
    npm i -D --no-audit --no-fund --omit=optional $add
  }
  if(-not (Test-Path "node_modules/.bin/netlify")){
    Write-Info "Installiere netlify-cli (dev)"
    npm i -D --no-audit --no-fund --omit=optional netlify-cli
  }
}

function Ensure-Scripts([string]$fw, [ref]$pkgRef){
  $pkg = $pkgRef.Value
  if(-not $pkg.PSObject.Properties['scripts']){
    $pkg | Add-Member -NotePropertyName scripts -NotePropertyValue ([ordered]@{}) -Force
  }
  if($pkg.scripts -isnot [hashtable]){
    $ht = [ordered]@{}
    foreach($p in $pkg.scripts.PSObject.Properties){ $ht[$p.Name] = $p.Value }
    $pkg.scripts = $ht
  }
  function SetScript([string]$name,[string]$value){
    if(-not $pkg.scripts.Contains($name) -or [string]::IsNullOrWhiteSpace([string]$pkg.scripts[$name])){
      $pkg.scripts[$name] = $value
    }
  }
  switch($fw){
    "next" {
      SetScript "build"  "next build"
      SetScript "dev"    "next dev"
      SetScript "start"  "next start"
    }
    "vite" {
      SetScript "build"   "vite build"
      SetScript "dev"     "vite"
      SetScript "preview" "vite preview"
    }
    default {
      SetScript "build" 'node -e "console.error(`"No build script defined`"); process.exit(1)"'
    }
  }
  Save-Json -obj $pkg -path (Resolve-Path "package.json").Path
}

function Write-NetlifyToml([string]$fw){
  $base = @"
[build.environment]
NODE_VERSION = "$NodeVersion"
NPM_FLAGS = "--no-audit --no-fund"

[build]
command = "npm run build"
"@
  switch($fw){
    "next" {
      return @"
$base
publish = ".next"

[[plugins]]
package = "@netlify/plugin-nextjs"
"@
    }
    "vite" {
      return @"
$base
publish = "dist"
"@
    }
    default {
      return @"
$base
publish = "dist"
"@
    }
  }
}

function Fix-NetlifyToml([string]$fw){
  $path = Join-Path (Get-Location) "netlify.toml"
  $content = Write-NetlifyToml $fw
  Save-TextLF -path $path -text $content
  Write-Info "netlify.toml geschrieben für '$fw' -> $path"
}

function Verify(){
  Write-Info "Verify: Lokaler Netlify-Build"
  Ensure-Dir "logs"
  $ts  = Get-Date -Format "yyyyMMdd_HHmmss"
  $log = "logs\netlify_build_$ts.txt"

  if(Test-Path "package-lock.json"){ Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue }
  npm i --no-audit --no-fund --omit=optional 2>&1 | Tee-Object -FilePath $log
  npx netlify build 2>&1 | Tee-Object -FilePath $log -Append

  $text = Get-Content $log -Raw
  if($text -match "Build completed|Netlify Build Complete|Success"){
    Write-Info "Verify OK. Log: $log"
    return @{ ok = $true; log = $log }
  } else {
    Write-Err "Verify FAIL. Log: $log"
    return @{ ok = $false; log = $log; text = $text }
  }
}

function Apply(){
  Write-Info "Apply: Pakete, Skripte, netlify.toml"
  if(!(Test-Path "package.json")){ throw "package.json fehlt im aktuellen Ordner." }
  $pkgPath = (Resolve-Path "package.json").Path
  $pkg = Read-Json $pkgPath
  $fw  = Detect-Framework $pkg
  Write-Info "Erkanntes Framework: $fw"
  Ensure-Dependencies $fw
  Ensure-Scripts $fw ([ref]$pkg)
  Fix-NetlifyToml $fw
}

function SelfHeal([int]$max){
  for($i=1; $i -le $max; $i++){
    Write-Warn "Self-Heal Versuch $i/$max"
    if(Test-Path "netlify.toml"){
      $c = Get-Content netlify.toml -Raw
      Save-TextLF -path "netlify.toml" -text $c
    }
    foreach($d in @(".next","dist","node_modules")){
      if(Test-Path $d){ Remove-Item $d -Recurse -Force -ErrorAction SilentlyContinue }
    }
    if(Test-Path "package-lock.json"){ Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue }

    Apply
    $v = Verify
    if($v.ok){ return $v }
  }
  return @{ ok = $false }
}

Write-Info ("Node " + (node -v) + " npm " + (npm -v))
Apply
$r = Verify
if(-not $r.ok){
  $heal = SelfHeal -max $MaxHeal
  if(-not $heal.ok){
    Write-Err "Self-Heal gescheitert."
    exit 2
  }
}
Write-Info "Fertig."
