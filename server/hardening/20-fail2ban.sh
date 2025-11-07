#!/usr/bin/env bash
set -euo pipefail
apt-get update -y
apt-get install -y fail2ban
mkdir -p /etc/fail2ban/jail.d

cat >/etc/fail2ban/jail.d/sf1-sshd.conf <<'JAIL'
[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = systemd
maxretry = 4
findtime = 10m
bantime  = 1h
ignorecommand =
JAIL

systemctl enable --now fail2ban
fail2ban-client status sshd || true