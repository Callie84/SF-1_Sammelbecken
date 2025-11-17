#!/usr/bin/env bash
set -euo pipefail
# UFW nur konfigurieren, nicht blind aktivieren, wenn ufw nicht genutzt wird.
apt-get update -y
apt-get install -y ufw

ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
# Optional: NodePortâ€‘Range Ã¶ffnen, wenn Kubernetes NodePorts genutzt werden
# ufw allow 30000:32767/tcp

# Aktivierung bewusst auskommentiert, um Selfâ€‘Lockout zu vermeiden.
# ufw --force enable

ufw status verbose || true