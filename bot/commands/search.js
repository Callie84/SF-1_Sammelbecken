const fetch = require('node-fetch');

exports.exec = async (bot, chatId, query) => {
  try {
    const res = await fetch(process.env.API_URL + '/seeds?search=' + encodeURIComponent(query));
    const data = await res.json();
    if (!data.length) {
      return bot.sendMessage(chatId, 'Keine Sorten gefunden.');
    }
    const msg = data.slice(0,5).map(item => {
      const prices = item.price_per_pack.map(p=>`${p.pack_size} Stk: €${p.price_eur.toFixed(2)}`).join('\n');
      return `*${item.strain}*\nSeedbank: ${item.seedbank}\n${prices}\n[Shop](${item.url})`;
    }).join('\n\n');
    bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
  } catch (err) {
    bot.sendMessage(chatId, 'Fehler bei der Suche.');
  }
};