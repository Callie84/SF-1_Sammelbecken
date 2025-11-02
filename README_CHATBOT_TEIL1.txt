🤖 Grow-Community Chatbot – Teil 1:
- **Service**:
  • sendChatMessage(userId, message): ruft OpenAI API (gpt-4o-mini) mit Prompt auf  
- **Controller**:
  • POST /chatbot/message { message } → { reply }  
- **Route**:
  • routes/chatbot.js unter `/api/chatbot` (auth required)  
- **Umgebungsvariable**:
  • OPENAI_API_KEY  
- **Anwendung**:
  • Ermöglicht Community-Nutzern, per Chatbot Fragen zu SF-1, Grow-Tipps und Community-Inhalten zu stellen