#!/usr/bin/env bash
set -euo pipefail
BACKUP_ROOT="/root/sf1-hardening-backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_ROOT/etc/"
cp -a /etc/sysctl.conf "$BACKUP_ROOT/etc/sysctl.conf" || true

cat >/etc/sysctl.d/90-sf1.conf <<'SYS'
# Network hardening
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_source_route = 0
# Limits
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
fs.protected_symlinks = 1
fs.protected_hardlinks = 1
SYS

sysctl --system