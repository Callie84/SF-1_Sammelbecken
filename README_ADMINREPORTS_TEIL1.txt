📊 Admin Reports – Teil 1:
- Service:
  • getPlanStats(): {freeCount, premiumCount}
  • getUserStats(): {totalUsers, newLastMonth}
  • getGrowUsage(): {totalCycles, avgCyclesPerUser}
- Controller & Routen (/admin/reports):
  • GET /admin/reports/plans
  • GET /admin/reports/users
  • GET /admin/reports/usage
- Auth + Admin-Role erforderlich