🔍 Filter-Builder – Teil 1:
- Modell: Seed.js (Sorte, Seedbank, Genetik, THC, CBD, Blütezeit, Indoor-Ertrag, Preise)
- Routen:
  - GET /filters → Liste der verfügbaren Filterfelder
  - GET /filters/:field → Eindeutige Werte für das gewählte Feld (z.B. seedbank, genetics)
- Validierte Felder: seedbank, genetics, flowering_time, indoor_yield