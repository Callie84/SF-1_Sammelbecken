# API Spec (v1)

## Auth
- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password }
- POST /api/auth/logout

## Prices / Seeds
- GET /api/prices/today â†’ [ { name, currentPrices[], lastUpdated } ]
- GET /api/prices/search?query=TERM â†’ [Seed]
- GET /api/seeds/:id â†’ Seed Detail

## Tools
- POST /api/tools/power-cost { watt, kwhPrice, hoursVeg, hoursBloom, hoursPerDayVeg, hoursPerDayBloom }
- POST /api/tools/dli-from-ppfd { ppfd, photoperiodHours }
- POST /api/tools/ppfd-from-dli { dli, photoperiodHours }

## User
- GET /api/user/me
- POST /api/user/favorites { seedId }
- DELETE /api/user { } â†’ Account lÃ¶schen