export async function sendChatMessage(message) {
  const res = await fetch(process.env.REACT_APP_API_URL + '/api/chatbot/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chatbot error');
  return data.reply;
}