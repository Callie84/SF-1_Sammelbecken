const fetch = require('node-fetch');

exports.exec = async (bot, chatId, args) => {
  const subcmd = args[0];
  const userId = chatId; // mapping chat->user
  if (subcmd === 'add') {
    const strain = args.slice(1).join(' ');
    await fetch(process.env.API_URL + '/wishlist/lists/default/items', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+process.env.API_TOKEN },
      body: JSON.stringify({ strain })
    });
    bot.sendMessage(chatId, `✅ "${strain}" hinzugefügt.`);
  } else if (subcmd === 'list') {
    const res = await fetch(process.env.API_URL + '/wishlist/lists/default', {
      headers: { 'Authorization':'Bearer '+process.env.API_TOKEN }
    });
    const list = await res.json();
    if (!list.items.length) return bot.sendMessage(chatId, 'Deine Wunschliste ist leer.');
    const msg = list.items.map(i=>`• ${i.strain}`).join('\n');
    bot.sendMessage(chatId, `Deine Favoriten:\n${msg}`);
  } else {
    bot.sendMessage(chatId, 'Unbekannter Wishlist-Befehl.');
  }
};