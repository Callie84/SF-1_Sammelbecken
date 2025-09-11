📤 Upload eigener Sorten – Teil 2:
- Admin-Review:
  • POST /upload/review/:id (admin): { approved: true/false, feedback: "..." }
- Nutzer-Status:
  • GET /upload/status : Liefert alle Uploads mit Moderationsinformationen
- Modell-Erweiterung:
  • moderation: { approved, feedback, reviewedAt }
- LogService zeichnet Review-Aktionen auf (UPLOAD_APPROVED / UPLOAD_REJECTED)