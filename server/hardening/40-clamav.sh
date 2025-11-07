#!/usr/bin/env bash
set -euo pipefail
apt-get update -y
apt-get install -y clamav clamav-daemon
systemctl stop clamav-freshclam || true
freshclam
systemctl enable --now clamav-freshclam
systemctl enable --now clamav-daemon

# WÃ¶chentlicher Scan /root und /var/www (falls vorhanden)
cat >/etc/cron.weekly/sf1-clamav <<'CRON'
#!/bin/sh
nice -n 19 clamscan -ri /root /var/www 2>/dev/null | tee -a /var/log/clamav/weekly-sf1.log || true
CRON
chmod +x /etc/cron.weekly/sf1-clamav