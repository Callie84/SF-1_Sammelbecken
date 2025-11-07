#!/usr/bin/env bash
set -euo pipefail
BACKUP_ROOT="/root/sf1-hardening-backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_ROOT/etc/ssh"
cp -a /etc/ssh/sshd_config "$BACKUP_ROOT/etc/ssh/sshd_config" || true

# Sichere SSH-Defaults
cat >/etc/ssh/sshd_config.d/90-sf1.conf <<'CONF'
# SF-1 hardened SSH
Port 22
Protocol 2
PermitRootLogin prohibit-password
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
AuthenticationMethods publickey
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 20
MaxAuthTries 3
MaxSessions 4
AllowTcpForwarding no
X11Forwarding no
AllowAgentForwarding no
PermitTunnel no
Banner /etc/issue.net
LogLevel VERBOSE
# Strong algorithms
KexAlgorithms curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
CONF

# Banner
echo "Authorized access only. All activity may be monitored." >/etc/issue.net

# Test & reload
sshd -t
systemctl reload ssh || systemctl restart ssh