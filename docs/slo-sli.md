# SLO/SLI â€” Definitionen

## Begriffe
- **SLI**: MessgrÃ¶ÃŸe, z.â€¯B. Fehlerrate oder Latenz.
- **SLO**: Zielwert, z.â€¯B. Fehlerrate â‰¤ 0,1â€¯%.
- **Error Budget**: 100â€¯% âˆ’ SLO, z.â€¯B. 0,1â€¯% Ausfall erlaubt in 30 Tagen.

## SFâ€‘1 SLI
1. **API Fehlerrate**: Anteil `status_code>=500` an allen Requests.
2. **API Latenz**: p95/p99 von `http_request_duration_seconds`.
3. **Extern VerfÃ¼gbarkeit**: Anteil `probe_success==1`.

## SLO
- Fehlerrate â‰¤ 0,1â€¯% auf 30 Tage.
- p95 â‰¤ 300â€¯ms (5 Min), p99 â‰¤ 600â€¯ms (5 Min).
- VerfÃ¼gbarkeit â‰¥ 99,9â€¯% auf 30 Tage.

## Visualisierung
- Grafanaâ€‘Dashboard `sf1-slo-overview` zeigt SLIs, Error Budget, Burn Rate und Latenzen.

## Betrieb
- Ã„nderungen am SLO in `slo-recording-rules.yml` anpassen, Dashboard passt sich an.

## Status & NÃ¤chste Aktion
**Status:** Definitionen und Artefakte bereit.  
**NÃ¤chste Aktion:** Prometheusâ€‘Rules & Alerts anwenden, Dashboard importieren.