# Runbooks (Betrieb)

## Deploy Rollback (API)
1) `kubectl -n sf1 rollout history deploy/sf1-backend`
2) `kubectl -n sf1 rollout undo deploy/sf1-backend --to-revision=N`
3) Smokeâ€‘Test `/health`

## DB Restore