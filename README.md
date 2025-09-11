# SF-1_Sammelbecken
# 🌱 SF-1 – SeedFinder PRO

SeedFinder PRO ist eine modulare Plattform für **Cannabis-Samenvergleich, Grow-Management und Wissensressourcen**.  
Projektstatus: **Work in Progress** – produktionsreifer Aufbau für seedfinderpro.de.

---

## 🚀 Features

- **Seedbank-Scraper**: Live-Preisvergleich von führenden Seedbanks (Zamnesia, Royal Queen Seeds, Dutch Passion, Barney’s Farm, Linda Seeds, Fast Buds usw.)
- **User-System**: Registrierung, Login, Rollen, Favoriten, Premiumstatus, Account-Löschung
- **Grow-Manager**: Tools für Planung, EC/pH/DLI-Rechner, Ertragskalkulation
- **UGG-1 Integration**: Vollständiger Grow-Guide als PDF/HTML eingebunden
- **Affiliate & Ads**: Kontextabhängige Banner, Rabattcodes, Partnerlinks
- **Analytics**: Besucherauswertung und Preisentwicklung
- **PWA & Android App**: Installation auf Desktop und Smartphone
- **Kubernetes-Deployment**: Skalierbar auf Netcup RS1000 SE

---

## 🛠️ Tech-Stack

- **Frontend**: React + Tailwind, PWA-fähig, modulare Sidebar (SeedFinder, GrowManager, Downloads, Settings)
- **Backend**: Node.js (Express), MongoDB
- **Deployment**: Debian 12, Apache/Nginx, Certbot, Docker/Kubernetes
- **Server**: Netcup RS1000 SE (8 GB RAM, 4 Kerne, 256 GB SSD)
- **Domain**: [seedfinderpro.de](https://seedfinderpro.de)
  
---

## 📂 Projektstruktur


SF-1/
├── apps/
│ ├── frontend/ # React-Client
│ ├── backend/ # Express/MongoDB-Server
│ └── scraper/ # Module für Seedbanks
├── docs/ # Dokumentation & Guides
├── scripts/ # Setup- und Deployment-Skripte
└── README.md


