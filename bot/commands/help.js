exports.exec = (bot, msg) => {
  const helpText = `
Willkommen beim SF-1 Bot!
VerfÃ¼gbare Befehle:
/search <Sorte> - Suche nach Sorten und Preise
/wishlist add <Strain> - Zu Favoriten hinzufÃ¼gen
/wishlist list - Liste deiner Favoriten
/help - Zeige diese Hilfe
`;
  bot.sendMessage(msg.chat.id, helpText);
};
