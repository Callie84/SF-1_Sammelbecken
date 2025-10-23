# Programm: PowerShell
# Zweck: HÃ¤rtungs-Skripte sicher auf 152.53.252.68 ausfÃ¼hren (kein Auto-Run jetzt)
param(
  [string]$Host = '152.53.252.68',
  [string]$User = 'root',
  [string]$Key  = "$env:USERPROFILE\.ssh\sf1"
)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$src  = Join-Path $repo 'server/hardening'

$files = Get-ChildItem $src -Filter '*.sh' | Sort-Object Name
if(-not $files){ throw 'Keine .sh Skripte gefunden' }

# 1) Kopieren
foreach($f in $files){
  & scp -i $Key $f.FullName "$User@$Host:/root/$(Split-Path $f.Name -Leaf)"
}

# 2) Remote ausfÃ¼hrbar machen und sequenziell laufen lassen (mit Syntax-Checks)
$script = @'
set -euo pipefail
mkdir -p /root/sf1-hardening-backups/$(date +%Y%m%d)
chmod +x /root/*.sh
for f in /root/*.sh; do echo "[SF-1] RUN $f"; bash -n "$f" && bash "$f"; done
'@

$bytes = [System.Text.Encoding]::UTF8.GetBytes($script)
$tmp = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllBytes($tmp,$bytes)

& scp -i $Key $tmp "$User@$Host:/root/run-hardening.sh"
& ssh -o "IdentitiesOnly yes" -i $Key "$User@$Host" "bash /root/run-hardening.sh"