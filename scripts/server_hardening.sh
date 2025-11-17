#!/usr/bin/env bash
set -euo pipefail

sudo apt update && sudo apt -y upgrade
sudo timedatectl set-timezone Europe/Berlin
sudo apt -y install ufw fail2ban curl git jq ca-certificates gnupg

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw --force enable
sudo systemctl enable --now fail2ban

curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"

curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes