# SF-1 ÜBERGABE-DATEI (MASTER)

## 1. Projektkontext
- Projekt: SF-1 (SeedFinder PRO)
- Repo (remote): https://github.com/Callie84/SF-1_Sammelbecken
- Lokaler Pfad (User): C:\Users\kling\Desktop\SF-1_Sammelbecken
- Server: Netcup RS1000 SE (Debian 12), Domain: seedfinderpro.de
- Namespaces: default, monitoring, backup, testing
- Ingress: caddy
- CI: GitHub Actions, Pflicht-Check: Smoke/smoke

## 2. Arbeitsregeln
1. Sprache: Deutsch.
2. Keine Platzhalter.
3. PowerShell ≠ mongosh ≠ YAML ≠ React.
4. Immer Programm: und Ort: angeben.
5. Canvas-First für technische Blöcke.
6. Dokumentationspflicht am Ende.

## 3. Aktueller Stand
- FEAT: Vite-Branch vorhanden.
- K8s-Deploy-Skript: .\scripts\deploy-k8s.ps1 wendet mehrere YAMLs an.
- Kubeconfig auf Client prüfen.

## 4. Offene Nächste Schritte
1. Kubeconfig vom Netcup-Cluster prüfen.
2. K8s-Manifeste härten.
3. Scraper-/Preis-Module täglich laufen lassen.
4. Übergabedatei bei jedem “Ü” aktualisieren.

## 5. Letzte Änderungen
- 2025-10-31: Übergabedatei angelegt.
