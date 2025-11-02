🛠 Setup-Planer II – Teil 2:
- **Benutzer-Templates**:
  • Modell: UserTemplate (userId, name, layoutData)
  • Service:
    - upsertTemplate(userId, { id?, name, layoutData })
    - listTemplates(userId)
    - deleteTemplate(userId, id)
  • Controller & Routen:
    - POST /planner/user/templates { id?, name, layoutData }
    - GET /planner/user/templates
    - DELETE /planner/user/templates/:id
  • Nutzervorlagen persistieren und verwalten