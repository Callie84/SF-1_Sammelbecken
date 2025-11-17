#!/usr/bin/env bash
set -euo pipefail
apt-get update -y
apt-get install -y auditd audispd-plugins
mkdir -p /etc/audit/rules.d

# Backup
BACKUP_ROOT="/root/sf1-hardening-backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_ROOT/etc/audit/rules.d"
cp -a /etc/audit/auditd.conf "$BACKUP_ROOT/etc/audit/" || true

# Rotate groÃŸvolumiger Logs automatisch
sed -i 's/^max_log_file_action.*/max_log_file_action = ROTATE/' /etc/audit/auditd.conf

cat >/etc/audit/rules.d/sf1.rules <<'RULES'
## Ãœberwache kritische Ã„nderungen
-w /etc/ssh/sshd_config -p wa -k ssh_config
-w /etc/sudoers -p wa -k sudoers
-w /etc/passwd -p wa -k passwd
-w /etc/shadow -p wa -k shadow
-w /etc/group -p wa -k group
-a always,exit -F arch=b64 -S execve -k exec
-a always,exit -F arch=b64 -S chmod,chown,fchmod,fchown -k permchange
RULES

augenrules --load
systemctl enable --now auditd