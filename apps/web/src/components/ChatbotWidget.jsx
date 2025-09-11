import React, { useState } from 'react';
import { sendChatMessage } from '../api/chatbotApi';

export default function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    try {
      const reply = await sendChatMessage(input);
      setMessages(msgs => [...msgs, userMsg, { sender: 'bot', text: reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, userMsg, { sender: 'bot', text: 'Fehler beim Chatbot.' }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow-lg flex flex-col">
      <div className="p-2 bg-blue-600 text-white font-bold">SF-1 Chatbot</div>
      <div className="p-2 flex-1 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${m.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-2 flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="px-4 bg-blue-600 text-white rounded-r">Senden</button>
      </div>
    </div>
  );
}