[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- feste Pfade ---
$RepoRoot  = "C:\Users\kling\Desktop\SF-1_Sammelbecken"
$AppPath   = Join-Path $RepoRoot "apps\price-service"
$PatchFile = Join-Path $RepoRoot "price-service-parser-patch.md"
$TargetJS  = Join-Path $AppPath "src\parsers\list.debug.js"
$TargetTS  = Join-Path $AppPath "src\parsers\list.ts"

# --- Log/Backups ---
$Stamp      = Get-Date -Format "yyyyMMdd_HHmmss"
$LogDir     = Join-Path $AppPath "patch-logs"
$BkpDir     = Join-Path $AppPath ("backup_"+$Stamp)
$LogFile    = Join-Path $LogDir ("apply_patch_"+$Stamp+".log")
$Transcript = Join-Path $LogDir ("transcript_"+$Stamp+".txt")

# --- Hilfsfunktionen ---
function Write-Info($msg){ ("[INFO]  {0}" -f $msg)  | Tee-Object -FilePath $LogFile -Append | Out-Null }
function Write-Warn($msg){ ("[WARN]  {0}" -f $msg)  | Tee-Object -FilePath $LogFile -Append | Out-Null }
function Write-Err ($msg){ ("[ERROR] {0}" -f $msg)  | Tee-Object -FilePath $LogFile -Append | Out-Null; throw $msg }

function Get-CodeForFile {
    param(
        [Parameter(Mandatory)] [string]$Markdown,
        [Parameter(Mandatory)] [string]$RelativePathMarker  # z.B. src/parsers/list.debug.js
    )
    # Abschnitt anhand "## Datei: `…`" finden (Backticks optional)
    $pat = ('(?ms)^##\s+Datei:\s*`?{0}`?\s*$([\s\S]*?)(?=^##\s+Datei:|^##\s+Hinweis|\z)' -f [regex]::Escape($RelativePathMarker))
    $m = [regex]::Match($Markdown, $pat, 'Multiline')
    if(-not $m.Success){ return $null }
    $sectionText = $m.Groups[1].Value

    # ersten Codeblock ```...``` extrahieren
    $codePat = '```(?:[a-zA-Z0-9-]+)?\s*([\s\S]*?)\s*```'
    $cm = [regex]::Match($sectionText, $codePat)
    if(-not $cm.Success){ return $null }
    return $cm.Groups[1].Value
}

# --- Vorbedingungen ---
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
Start-Transcript -Path $Transcript -Force | Out-Null

Write-Info ("Starte Patch-Prozess: {0}" -f $Stamp)
if(-not (Test-Path $AppPath)){ Write-Err ("App-Pfad nicht gefunden: {0}" -f $AppPath) }
if(-not (Test-Path $PatchFile)){ Write-Err ("Patch-Datei nicht gefunden: {0}" -f $PatchFile) }

# Markdown laden
$md = Get-Content -Path $PatchFile -Raw -Encoding UTF8
if([string]::IsNullOrWhiteSpace($md)){ Write-Err ("Patch-Datei ist leer: {0}" -f $PatchFile) }

# Codeblöcke extrahieren
Write-Info ("Extrahiere Code für list.debug.js und list.ts aus: {0}" -f $PatchFile)
$codeJS = Get-CodeForFile -Markdown $md -RelativePathMarker "src/parsers/list.debug.js"
$codeTS = Get-CodeForFile -Markdown $md -RelativePathMarker "src/parsers/list.ts"

if(-not $codeJS){ Write-Err "Kein Codeblock für src/parsers/list.debug.js im Patch gefunden." }
if(-not $codeTS){ Write-Err "Kein Codeblock für src/parsers/list.ts im Patch gefunden." }

# Backup anlegen
New-Item -ItemType Directory -Force -Path $BkpDir | Out-Null
if(Test-Path $TargetJS){ Copy-Item $TargetJS (Join-Path $BkpDir "list.debug.js.bak") -Force; Write-Info ("Backup JS: {0}" -f (Join-Path $BkpDir "list.debug.js.bak")) }
if(Test-Path $TargetTS){ Copy-Item $TargetTS (Join-Path $BkpDir "list.ts.bak")       -Force; Write-Info ("Backup TS: {0}" -f (Join-Path $BkpDir "list.ts.bak")) }

# Patch anwenden
Write-Info "Schreibe neue Dateien..."
$null = New-Item -ItemType Directory -Force -Path (Split-Path $TargetJS)
$null = New-Item -ItemType Directory -Force -Path (Split-Path $TargetTS)
Set-Content -Path $TargetJS -Value $codeJS -Encoding UTF8
Set-Content -Path $TargetTS -Value $codeTS -Encoding UTF8
Write-Info ("Dateien aktualisiert:`n - {0}`n - {1}" -f $TargetJS, $TargetTS)

# Existenzprüfung
if(-not (Test-Path $TargetJS) -or -not (Test-Path $TargetTS)){ Write-Err "Dateien fehlen nach Schreiben. Abbruch." }

# Dependencies und Tests
Write-Info "Prüfe Node-Umgebung und Dependencies"
Push-Location $AppPath
try{
    if(-not (Test-Path (Join-Path $AppPath "node_modules"))){
        Write-Info "node_modules fehlt → führe 'npm ci' aus"
        npm ci | Tee-Object -FilePath $LogFile -Append
        if($LASTEXITCODE -ne 0){ Write-Err "npm ci fehlgeschlagen." }
    } else {
        Write-Info "node_modules vorhanden"
    }

    Write-Info "Starte Tests: npm run test:discover"
    $out = npm run test:discover 2>&1 | Tee-Object -FilePath $LogFile -Append
    if($LASTEXITCODE -ne 0 -or ($out -join "`n") -match '(?i)\b(fail|error|failed|exceptions?)\b'){
        Write-Warn "Tests melden Fehler. Rolle auf Backup zurück."
        if(Test-Path (Join-Path $BkpDir "list.debug.js.bak")){ Copy-Item (Join-Path $BkpDir "list.debug.js.bak") $TargetJS -Force }
        if(Test-Path (Join-Path $BkpDir "list.ts.bak"))      { Copy-Item (Join-Path $BkpDir "list.ts.bak")       $TargetTS -Force }
        Write-Err "Rollback durchgeführt. Bitte Patch-Inhalt prüfen."
    }

    Write-Info "Tests erfolgreich. Patch bleibt aktiv."
}
finally{
    Pop-Location
}
Write-Info "Fertig."
Stop-Transcript | Out-Null
