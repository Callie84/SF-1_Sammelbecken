<#
.SYNOPSIS
  Erzeugt neue SF-1 Secrets lokal (JSON, .env, K8s-Secret-YAML unversiegelt) für spätere Versiegelung mit kubeseal.
  Führt KEINE Cluster-Befehle aus. Keine Änderungen an Produktion.

.PARAMETER Env
  Zielumgebung: prod oder staging. Standard: prod.

.PARAMETER OutDir
  Ausgabeverzeichnis für Pending-Dateien. Standard: k8s\secrets\pending

.OUTPUTS
  - sf1_secrets_<env>_<timestamp>.json
  - sf1_secrets_<env>.env
  - sf1-secrets-<env>.secret.yaml (K8s Secret, base64, NICHT versiegelt)
  - sf1_secrets_<env>_fingerprints.txt (SHA256-Fingerprints, zum Abgleich)
#>

param(
  [ValidateSet('prod','staging')]
  [string]$Env = 'prod',
  [string]$OutDir = "$(Split-Path -Parent $PSCommandPath)\..\k8s\secrets\pending"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Hilfsfunktionen
function New-RandomString {
  param([int]$Length = 64, [string]$Alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}:,.?/')
  $bytes = New-Object 'System.Byte[]' ($Length*2)
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $sb = New-Object System.Text.StringBuilder
  for ($i=0; $i -lt $Length; $i++) {
    $idx = [int]([BitConverter]::ToUInt16($bytes, $i*2) % $Alphabet.Length)
    [void]$sb.Append($Alphabet[$idx])
  }
  $sb.ToString()
}

function To-Base64([string]$s) {
  [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($s))
}

# Zielpfade
$OutDir = (Resolve-Path -LiteralPath $OutDir -ErrorAction SilentlyContinue) ?? (New-Item -ItemType Directory -Force -Path $OutDir).FullName
$ts = Get-Date -Format 'yyyyMMddHHmm'
$jsonPath = Join-Path $OutDir "sf1_secrets_${Env}_${ts}.json"
$envPath  = Join-Path $OutDir "sf1_secrets_${Env}.env"
$yamlPath = Join-Path $OutDir "sf1-secrets-${Env}.secret.yaml"
$fprPath  = Join-Path $OutDir "sf1_secrets_${Env}_fingerprints.txt"

# Secretwerte erzeugen
$secrets = [ordered]@{
  "MONGO_PASS"        = (New-RandomString -Length 40)
  "JWT_SECRET"        = (New-RandomString -Length 64)
  "COOKIE_SECRET"     = (New-RandomString -Length 64)
  "S3_ACCESS_KEY"     = (New-RandomString -Length 24 -Alphabet 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  "S3_SECRET_KEY"     = (New-RandomString -Length 44)
  "SMTP_PASS"         = (New-RandomString -Length 32)
  "ALERT_SMTP_PASS"   = (New-RandomString -Length 32)
  "OAUTH_GITHUB_SECRET" = (New-RandomString -Length 48)
  "SESSION_KEY"       = (New-RandomString -Length 64)
}

# JSON speichern
$secrets | ConvertTo-Json -Depth 3 | Out-File -FilePath $jsonPath -Encoding UTF8 -NoNewline

# .env speichern
@(
  "# sf1 secrets ($Env) – NICHT einchecken"
  "MONGO_PASS=$($secrets.MONGO_PASS)"
  "JWT_SECRET=$($secrets.JWT_SECRET)"
  "COOKIE_SECRET=$($secrets.COOKIE_SECRET)"
  "S3_ACCESS_KEY=$($secrets.S3_ACCESS_KEY)"
  "S3_SECRET_KEY=$($secrets.S3_SECRET_KEY)"
  "SMTP_PASS=$($secrets.SMTP_PASS)"
  "ALERT_SMTP_PASS=$($secrets.ALERT_SMTP_PASS)"
  "OAUTH_GITHUB_SECRET=$($secrets.OAUTH_GITHUB_SECRET)"
  "SESSION_KEY=$($secrets.SESSION_KEY)"
) | Out-File -FilePath $envPath -Encoding UTF8

# Fingerprints (SHA256) erstellen
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$lines = foreach ($k in $secrets.Keys) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($secrets[$k])
  $hash = ($sha256.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join ''
  "{0}  {1}" -f $hash, $k
}
$lines | Out-File -FilePath $fprPath -Encoding ASCII

# Kubernetes Secret (UNSEALED) YAML erzeugen
$k8sName = if ($Env -eq 'prod') { 'sf1-secrets' } else { "sf1-secrets-$Env" }
$encoded = $secrets.GetEnumerator() | ForEach-Object {
  "  {0}: {1}" -f $_.Key, (To-Base64 $_.Value)
}
$yaml = @"
apiVersion: v1
kind: Secret
metadata:
  name: $k8sName
  namespace: default
type: Opaque
data:
$($encoded -join "`n")
"@
$yaml | Out-File -FilePath $yamlPath -Encoding UTF8 -NoNewline

# Ausgabe
Write-Host "Erzeugt:" -ForegroundColor Cyan
Write-Host "  JSON: $jsonPath"
Write-Host "  ENV : $envPath"
Write-Host "  YAML: $yamlPath (UNSEALED)"
Write-Host "  FPR : $fprPath (SHA256-Fingerprints)"
Write-Host ""
Write-Host "NÄCHSTE SCHRITTE (DOKU, NICHT AUSFÜHREN HIER):" -ForegroundColor Yellow
Write-Host "  1) kubeseal --format yaml < $yamlPath > k8s\\secrets\\sealed\\$k8sName.sealed.yaml"
Write-Host "  2) Prüfen, Commit nur der Datei unter k8s\\secrets\\sealed\\"
Write-Host "  3) Rollout der Deployments/StatefulSets"
