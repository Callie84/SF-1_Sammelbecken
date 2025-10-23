exports.exec = (bot, msg) => {
  const helpText = `
Willkommen beim SF-1 Bot!
VerfÃƒÆ’Ã‚Â¼gbare Befehle:
/search <Sorte> - Suche nach Sorten und Preise
/wishlist add <Strain> - Zu Favoriten hinzufÃƒÆ’Ã‚Â¼gen
/wishlist list - Liste deiner Favoriten
/help - Zeige diese Hilfe
`;
  bot.sendMessage(msg.chat.id, helpText);
};
