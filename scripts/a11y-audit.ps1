# erzeugt einen a11y-Report via Playwright/axe gegen eine laufende Instanz
param(
[string]$BaseUrl = "http://localhost:3000",
[string[]]$Routes = @("/", "/search?q=haze", "/seed/123", "/journal")
)


$env:BASE_URL = $BaseUrl
$spec = "apps/frontend/tests/a11y.spec.ts"


# Dynamisch Datei erzeugen, wenn BASE_URL gesetzt werden soll
# (optional ausbaufähig). Hier direkte Ausführung:
node --version > $null
npx --yes playwright test $spec
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }