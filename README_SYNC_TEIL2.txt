🔄 Favoriten-Sync – Teil 2:
- Konfliktauflösung: letzter `updatedAt` gewinnt (resolveConflicts)
- Background-Sync:
  • POST /favorites/sync/background { changes } → merged changes zurück
- Geräteverwaltung:
  • POST /favorites/devices { deviceId, deviceName } → Gerät registrieren
  • GET /favorites/devices → Liste registrierter Geräte
- Models:
  • Device (userId, deviceId, deviceName, lastSync)