# Programm: PowerShell
# Zweck: Test-Alert direkt an Alertmanager schicken (bypasst Prometheus)
param(
  [ValidateSet('critical','warning','info')]
  [string]$Type = 'critical',
  [string]$AlertmanagerUrl = 'https://alertmanager.seedfinderpro.de/api/v2/alerts'
)

$ErrorActionPreference = 'Stop'

$now = (Get-Date).ToUniversalTime().ToString('o')
$body = @(
  @{
    "labels" = @{ "alertname" = "SF1Test"; "severity" = $Type; "service" = "sf1" }
    "annotations" = @{ "summary" = "SF-1 Test $Type"; "description" = "Manueller Test-Alert $Type" }
    "startsAt" = $now
  }
) | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri $AlertmanagerUrl -ContentType 'application/json' -Body $body | Out-Null
Write-Host "[SF-1] Test-Alert gesendet ($Type)."