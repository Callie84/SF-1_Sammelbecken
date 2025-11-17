# APPLY VITE-Migration (angepasst für kling)

# 1) Projektpfad setzen
$repo = "C:\Users\kling\Desktop\SF-1_Sammelbecken"
$frontend = "$repo\apps\frontend"

# 2) In Repo-Ordner wechseln
Set-Location $repo

# 3) Lokale Änderungen sichern
git stash push -m "backup before vite-migration" | Out-Null

# 4) Branch setzen
git switch feat/migrate-to-vite

# 5) Entry-Point suchen oder generieren
$entry = @("$frontend\src\main.tsx","$frontend\src\main.jsx","$frontend\src\index.tsx","$frontend\src\index.jsx","$frontend\src\index.js") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $entry) {
@'
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")).render(<App />);
'@ | Set-Content -Encoding utf8 "$frontend\src\index.jsx"
  $entry = "$frontend\src\index.jsx"
}
$entryHref = "./" + ($entry.Substring($frontend.Length+1) -replace "\\","/")

# 6) Vite-Konfiguration schreiben
@"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  root: '.',
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true }
});
"@ | Set-Content -Encoding utf8 "$frontend\vite.config.mjs"

# 7) index.html schreiben
@"
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SF-1</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="$entryHref"></script>
  </body>
</html>
"@ | Set-Content -Encoding utf8 "$frontend\index.html"

# 8) Netlify TOML ohne BOM
$netlify = @'
[build]
  base = "apps/frontend"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.18.1"
  NPM_FLAGS = "--no-audit --no-fund"
'@
$enc = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText("$repo\netlify.toml", ($netlify -replace "`r`n","`n"), $enc)

# 9) Git Hooks schreiben
$hookDir = "$repo\.git\hooks"
if (!(Test-Path $hookDir)) { New-Item -ItemType Directory -Path $hookDir | Out-Null }

# PowerShell Hook
@'
param()
Get-ChildItem -Recurse -File -Include *.toml,*.js,*.jsx,*.ts,*.tsx,*.json,*.css,*.html |
  ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $c = $c -replace "^\uFEFF",""
    $c = $c -replace "`r`n","`n"
    [IO.File]::WriteAllText($_.FullName,$c,(New-Object System.Text.UTF8Encoding($false)))
  }
'@ | Set-Content -Encoding utf8 "$hookDir\pre-commit.ps1"

# Batch Wrapper
@'
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0pre-commit.ps1"
exit /B %ERRORLEVEL%
'@ | Set-Content -Encoding ascii "$hookDir\pre-commit.bat"

# 10) Build ausführen
Push-Location $frontend
npm ci
npm run build
Pop-Location

Write-Host "✅ Migration abgeschlossen. dist/ sollte vorhanden sein."
