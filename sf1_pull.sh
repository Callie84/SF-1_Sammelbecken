#!/bin/bash
LOG=/root/sf1_docker_pulls.log
echo "START 11/01/2025 16:45:12" >> ""

images=(
  mongo:7
  mariadb:11
  node:20
  caddy:2
  ghcr.io/callie84/sf1-backend:latest
  ghcr.io/callie84/sf1-price-service:latest
)

for img in ""; do
  echo "PULL " >> ""
  docker pull "" >> "" 2>&1
done

echo "END 11/01/2025 16:45:12" >> ""
