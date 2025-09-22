#!/usr/bin/env bash
set -euo pipefail

echo "[SF-1] Clean"
rm -rf public .next out dist build
mkdir -p public

if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
  PKG=npm
elif [ -f yarn.lock ]; then
  PKG=yarn
elif [ -f pnpm-lock.yaml ]; then
  PKG=pnpm
else
  PKG=npm
fi
echo "[SF-1] Package manager: $PKG"

run() { echo "+ $*"; eval "$*"; }

# Install deps if package.json exists
if [ -f package.json ]; then
  case "$PKG" in
    npm)  run "npm ci || npm install" ;;
    yarn) run "yarn install --frozen-lockfile || yarn install" ;;
    pnpm) run "pnpm i --frozen-lockfile || pnpm i" ;;
  esac
fi

is_dep() { node -e "process.exit(!(require('./package.json')?.dependencies?.['$1']||require('./package.json')?.devDependencies?.['$1']))" 2>/dev/null || return 1; }

# 1) Next.js (Pages-Router -> static export)
if [ -f package.json ] && is_dep next; then
  echo "[SF-1] Framework: Next.js"
  run "${PKG} run build"
  # Try static export; falls back auf out/ wenn vorhanden
  if npx --yes next --help >/dev/null 2>&1 && npx --yes next export -o out; then
    cp -R out/* public/
    echo "[SF-1] Export → public/"
    exit 0
  fi
  # Kein Export möglich -> nutze .next/static nur falls vorhanden
  if [ -d ".next/static" ]; then
    cp -R .next/static public/
    echo "<h1>Next.js Build</h1><p>Diese App benötigt SSR. Aktuell nur statische Assets.</p>" > public/index.html
    exit 0
  fi
fi

# 2) Vite
if [ -f package.json ] && (is_dep vite || grep -qi '"vite\W*:' package.json); then
  echo "[SF-1] Framework: Vite"
  run "${PKG} run build"
  cp -R dist/* public/
  exit 0
fi

# 3) Create React App
if [ -f package.json ] && (is_dep react-scripts || grep -qi '"react-scripts' package.json); then
  echo "[SF-1] Framework: CRA"
  run "${PKG} run build"
  cp -R build/* public/
  exit 0
fi

# 4) Docusaurus
if [ -f docusaurus.config.* ] || ( [ -f package.json ] && is_dep "@docusaurus/core" ); then
  echo "[SF-1] Framework: Docusaurus"
  run "${PKG} run build"
  cp -R build/* public/
  exit 0
fi

# 5) Statisch
if [ -f index.html ]; then
  echo "[SF-1] Static site"
  cp -R * public/ 2>/dev/null || true
  exit 0
fi

# Fallback
echo "[SF-1] Kein erkanntes Build-System. Erzeuge Platzhalter-Index."
echo "<h1>SF-1 Sammelbecken</h1><p>Kein Build erkannt. Lege index.html oder package.json mit Build an.</p>" > public/index.html
