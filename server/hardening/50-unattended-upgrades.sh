#!/usr/bin/env bash
set -euo pipefail
apt-get update -y
apt-get install -y unattended-upgrades apt-listchanges

cat >/etc/apt/apt.conf.d/51unattended-upgrades <<'CFG'
Unattended-Upgrade::Origins-Pattern {
        "o=Debian,a=stable-security";
};
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:30";
CFG

cat >/etc/apt/apt.conf.d/20auto-upgrades <<'CFG'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
CFG