#!/usr/bin/env bash
set -euo pipefail
apt-get update -y
apt-get install -y lynis
lynis audit system --quiet | tee /root/lynis-scan.txt || true