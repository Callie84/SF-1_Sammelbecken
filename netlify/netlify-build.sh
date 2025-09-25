#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$THIS_DIR/.." && pwd)"
PUBLISH_DIR="$THIS_DIR/public"

PM="npm"
if [ -f "$ROOT_DIR/pnpm-lock.yaml" ]; then PM="pnpm"; fi
if [ -f "$ROOT_DIR/yarn.lock" ]; then PM="yarn"; fi

echo "[Info] Paketmanager: $PM"
cd "$ROOT_DIR"

if [ "$PM" = "pnpm" ]; then pnpm install; elif [ "$PM" = "yarn" ]; then yarn install; else npm ci || npm install; fi

if [ -d "$ROOT_DIR/apps/frontend" ]; then
  echo "[Build] apps/frontend"
  cd "$ROOT_DIR/apps/frontend"
  if [ "$PM" = "pnpm" ]; then pnpm install; elif [ "$PM" = "yarn" ]; then yarn install; else npm ci || npm install; fi
  if [ "$PM" = "pnpm" ]; then pnpm run build; elif [ "$PM" = "yarn" ]; then yarn build; else npm run build; fi
  mkdir -p "$PUBLISH_DIR"
  if [ -d "dist" ]; then rsync -a --delete "dist/" "$PUBLISH_DIR/"; fi
  if [ -d "build" ]; then rsync -a --delete "build/" "$PUBLISH_DIR/"; fi
  if [ -d "out" ];  then rsync -a --delete "out/"  "$PUBLISH_DIR/"; fi
  cd "$ROOT_DIR"
else
  echo "[Build] Repo-Root"
  if [ "$PM" = "pnpm" ]; then pnpm run build; elif [ "$PM" = "yarn" ]; then yarn build; else npm run build; fi
  mkdir -p "$PUBLISH_DIR"
  if [ -d "dist" ]; then rsync -a --delete "dist/" "$PUBLISH_DIR/"; fi
  if [ -d "build" ]; then rsync -a --delete "build/" "$PUBLISH_DIR/"; fi
  if [ -d "out" ];  then rsync -a --delete "out/"  "$PUBLISH_DIR/"; fi
fi

echo "[OK] Build fertig → $PUBLISH_DIR"