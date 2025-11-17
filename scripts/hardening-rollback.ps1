# Programm: PowerShell
# Zweck: Kernkonfiguration aus letztem Backup zurÃ¼ckholen
param(
  [string]$Host = '152.53.252.68',
  [string]$User = 'root',
  [string]$Key  = "$env:USERPROFILE\.ssh\sf1"
)
$ErrorActionPreference = 'Stop'

$restore = @('/etc/ssh/sshd_config','/etc/fail2ban/jail.d/sf1-sshd.conf','/etc/ufw/user.rules','/etc/audit/rules.d/sf1.rules')

$cmd = @"
set -euo pipefail
LAST=\$(ls -1dt /root/sf1-hardening-backups/* | head -n1)
[ -d "\$LAST" ] || { echo 'Kein Backup' >&2; exit 1; }
for p in ${restore[@]}; do if [ -f "\$LAST\$p" ]; then cp -f "\$LAST\$p" "$p"; fi; done
systemctl reload ssh || true
ufw reload || true
fail2ban-client reload || true
augenrules --load || true
"@

$bytes = [System.Text.Encoding]::UTF8.GetBytes($cmd)
$tmp = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllBytes($tmp,$bytes)
& scp -i $Key $tmp "$User@$Host:/root/rollback.sh"
& ssh -o "IdentitiesOnly yes" -i $Key "$User@$Host" "bash /root/rollback.sh"