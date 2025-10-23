# Programm: PowerShell
# Zweck: Health‑Überblick der Scraper (API + Kennzahlen)
$ErrorActionPreference = 'Stop'


$base = "https://seedfinderpro.de/api"
$endpoints = @(
"$base/prices/today?limit=1",
"$base/prices/trending?limit=1",
"$base/admin/scrapers"
)


$failed = @()
foreach ($u in $endpoints) {
try {
$r = Invoke-WebRequest -Uri $u -TimeoutSec 10 -UseBasicParsing
if ($r.StatusCode -ne 200) { throw "Status $($r.StatusCode)" }
Write-Host "OK - $u"
} catch { $failed += "$u : $_" }
}


if ($failed.Count) {
Write-Host "Fehler:" -ForegroundColor Red
$failed | ForEach-Object { Write-Host $_ -ForegroundColor Red }
exit 1
}


Write-Host "Alle Endpunkte OK" -ForegroundColor Green