🤖 Chatbot-Widget & Frontend-Integration
- **API**:
  • sendChatMessage(message): POST /api/chatbot/message → returns string reply
- **Component**:
  • ChatbotWidget.jsx: Sticky Chat-Widget unten rechts mit Nachrichtenansicht & Eingabefeld
- **Page**:
  • ChatbotPage.jsx: Einfache Seite, die Widget darstellt
- **Styling**:
  • Tailwind CSS für Layout, Fixed-Position, Farben, Scrollbar
- **Integration**:
  • ENV: REACT_APP_API_URL
  • In App-Router: Route "/chatbot" → ChatbotPage