💬 Community-Modul – Teil 2:
- Moderation (Admin):
  • DELETE /community/channels/:id
  • DELETE /community/messages/:id
- Gruppen & Events:
  • POST /community/ge { type: 'group'|'event', name, description, eventDate? }
  • GET /community/ge
  • POST /community/ge/:id/join
  • POST /community/ge/:id/rsvp { rsvp: true|false }
- Gamification:
  • Badge-Modell (Badge, UserBadge)
  • POST /community/badges (Admin)
  • POST /community/badges/award (Admin)
  • GET /community/users/:userId/badges
- Modelle: GroupEvent, Badge, UserBadge