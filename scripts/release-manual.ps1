# Programm: PowerShell
# Zweck: Manuell taggen und pushen (Fallback, wenn Automatik nicht verwendet wird)
param(
  [Parameter(Mandatory=$true)] [string]$Version  # z.B. v1.2.3
)

$ErrorActionPreference = 'Stop'

if($Version -notmatch '^v\d+\.\d+\.\d+$'){
  throw "Version muss im Format vX.Y.Z sein"
}

# Sicherheitscheck: Arbeitsverzeichnis sauber?
$gitStatus = (git status --porcelain)
if($gitStatus){ throw "Arbeitsverzeichnis nicht sauber. Committe zuerst." }

# Tag existiert?
$exists = git tag --list $Version
if($exists){ throw "Tag $Version existiert bereits" }

Write-Host "[SF-1] Tagge $Version"

git tag -a $Version -m "Release $Version"
git push origin $Version

Write-Host "[SF-1] Fertig: $Version gepusht. Deploy-Workflow wird durch Tag ausgelÃ¶st."