const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const searchCmd = require("./commands/search");
const wishlistCmd = require("./commands/wishlist");
const helpCmd = require("./commands/help");

const bot = new TelegramBot(config.token, { polling: true });

bot.onText(/\/start/, (msg) => {
  helpCmd.exec(bot, msg);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text.startsWith(config.prefix)) return;
  const [cmd, ...args] = msg.text.slice(1).split(" ");
  switch (cmd) {
    case "search":
      await searchCmd.exec(bot, chatId, args.join(" "));
      break;
    case "wishlist":
      await wishlistCmd.exec(bot, chatId, args);
      break;
    case "help":
    default:
      helpCmd.exec(bot, msg);
  }
});
