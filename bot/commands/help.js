exports.exec = (bot, msg) => {
  const helpText = `
Willkommen beim SF-1 Bot!
Verfügbare Befehle:
/search <Sorte> - Suche nach Sorten und Preise
/wishlist add <Strain> - Zu Favoriten hinzufügen
/wishlist list - Liste deiner Favoriten
/help - Zeige diese Hilfe
`;
  bot.sendMessage(msg.chat.id, helpText);
};