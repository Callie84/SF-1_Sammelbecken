Write-Host "== SF-1 Local CI ==" -ForegroundColor Cyan

Write-Host "
[1/4] price-service: build + fixtures..." -ForegroundColor Yellow
pushd .\apps\price-service
npm run build
npm run test:fixtures
popd

Write-Host "
[2/4] backend-workflow (nur npm ci)..." -ForegroundColor Yellow
# später: npm run test --workspace apps/backend
# aktuell nur placeholder
Write-Host "backend: OK (placeholder)"

Write-Host "
[3/4] seedscan-workflow (placeholder)..." -ForegroundColor Yellow
Write-Host "seedscan: OK (placeholder)"

Write-Host "
[4/4] e2e (wenn vorhanden)..." -ForegroundColor Yellow
npm run e2e --if-present

Write-Host "
Alles durch." -ForegroundColor Green
