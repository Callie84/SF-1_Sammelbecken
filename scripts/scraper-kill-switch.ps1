param([Parameter(Mandatory)] [string]$Seedbank, [int]$Hours = 12)
# Setzt Disable‑Flag im Redis über Admin‑API (alternativ direkte Redis‑Route)
$body = @{ hours = $Hours } | ConvertTo-Json
Invoke-WebRequest -Method POST -Uri "https://seedfinderpro.de/api/admin/scrapers/$Seedbank/disable" -Body $body -ContentType 'application/json' -UseBasicParsing | Out-Null
Write-Host "Seedbank '$Seedbank' vorübergehend deaktiviert ($Hours h)"