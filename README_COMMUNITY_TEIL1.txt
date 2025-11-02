💬 Community-Modul – Teil 1:
- Modelle:
  • Channel: name, description, createdBy, timestamps
  • Message: channelId, userId, content, timestamp
- Controller & Routen (auth):
  • GET /community/channels → Kanäle listen
  • POST /community/channels { name, description } → Kanal erstellen
  • POST /community/messages { channelId, content } → Nachricht senden
  • GET /community/messages/:channelId → Nachrichten eines Kanals
- Anwendung: Basis-Chat/Forum in SF-1