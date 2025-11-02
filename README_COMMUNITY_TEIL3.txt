💬 Community-Modul – Teil 3:
- **Admin-Analytics**:
  • GET /admin/analytics/channels → { totalChannels }
  • GET /admin/analytics/messages → { totalMessages, messagesPerChannel }
  • GET /admin/analytics/events → { totalGroupsEvents, upcomingEvents }
- **Moderations-Dashboard**:
  • GET /admin/moderation/logs?actionType=<type>&since=<ISODate>
    – listLogs(filter): liefert Aktionen (DELETE_CHANNEL, DELETE_MESSAGE, etc.)
- **Services**:
  • adminAnalyticsService: getChannelStats(), getMessageStats(), getEventStats()
  • adminLogService: listLogs({ actionType, since })
- **Routes**: unter `/admin/analytics` & `/admin/moderation` (Admin-only)