# Programm: PowerShell
# Zweck: Mongoâ€‘Restore aus S3 auf Zielâ€‘MongoDB
# Hinweis: BenÃ¶tigt AWS CLI lokal konfiguriert oder Zugangsdaten als Env.
param(
  [Parameter(Mandatory=$true)] [string]$S3Uri,            # z.B. s3://sf1-backups/mongo/latest-mongo-YYYYmmdd_HHMM.tar.gz
  [Parameter(Mandatory=$false)] [string]$EndpointUrl = "https://s3.eu-central-1.amazonaws.com",
  [Parameter(Mandatory=$true)] [string]$MongoUri          # z.B. mongodb://user:pass@host:27017/sf1?authSource=admin
)

$ErrorActionPreference = 'Stop'

$work = Join-Path $env:TEMP ("sf1-restore-" + [Guid]::NewGuid())
New-Item -ItemType Directory -Path $work | Out-Null

aws s3 cp $S3Uri (Join-Path $work 'dump.tar.gz') --endpoint-url $EndpointUrl | Out-Null

Write-Host "[SF-1] Entpacke ..."
& tar -xzf (Join-Path $work 'dump.tar.gz') -C $work

$dumpDir = Get-ChildItem $work -Directory | Select-Object -First 1
if(-not $dumpDir){ throw "Kein Dump gefunden" }

Write-Host "[SF-1] Restore â†’ $MongoUri"
& mongorestore --drop --uri=$MongoUri $dumpDir.FullName

Write-Host "[SF-1] Restore abgeschlossen."