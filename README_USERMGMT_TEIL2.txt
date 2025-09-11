🔐 Nutzerverwaltung – Teil 2:
- **Modell**: Subscription (plan: free|premium, status, Dates, provider IDs)
- **Service**:
  • createCheckoutSession(userId, plan) → { sessionId, url }
  • handleWebhook(event) → verarbeitet Zahlstatus
- **Controller**:
  • POST /subscription/start { plan } → Checkout-Session starten
  • POST /subscription/webhook → Webhook vom Payment-Provider
  • GET /subscription → Abodaten abrufen
- **Routen**: `/subscription` (auth für Start und GET)
- **Hinweis**: Stub für echten Provider (Stripe, PayPal)