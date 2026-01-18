import { Telegraf, Markup } from "telegraf";
import { config } from "./src/config.js";
import { saveUser, saveGroup, getAllTargets } from "./src/db.js";
import { askAI } from "./src/openai.js";
import { startMessage, helpMessage, broadcastTemplate, broadcastStatus } from "./src/messages.js";
import { isGroup, shouldReplyInGroup } from "./src/utils.js";

if (!config.botToken) {
  console.error("BOT_TOKEN missing");
  process.exit(1);
}

const bot = new Telegraf(config.botToken);

let botUsername = "";
bot.telegram.getMe().then(me => botUsername = me.username).catch(()=>{});

bot.start(async (ctx) => {
  await saveUser(ctx.from);

  const buttons = Markup.inlineKeyboard([
    [Markup.button.url("💌 Support", config.supportChannel || "https://t.me/")],
    [Markup.button.url("👑 Owner", `https://t.me/${ctx.from?.username || "telegram"}`)]
  ]);

  return ctx.replyWithMarkdown(startMessage(config.botName), buttons);
});

bot.command("help", async (ctx) => {
  await saveUser(ctx.from);
  return ctx.replyWithMarkdown(helpMessage());
});

bot.command("broadcast", async (ctx) => {
  await saveUser(ctx.from);

  if (ctx.from.id !== config.ownerId) {
    return ctx.replyWithMarkdown(broadcastStatus.notOwner);
  }

  const text = ctx.message.text || "";
  const msg = text.replace("/broadcast", "").trim();
  if (!msg) return ctx.replyWithMarkdown(broadcastStatus.empty);

  await ctx.replyWithMarkdown(broadcastStatus.started);

  const { users, groups } = await getAllTargets();
  const targets = [
    ...users.map(u => u.userId),
    ...groups.map(g => g.chatId)
  ];

  let sent = 0;
  let failed = 0;

  for (const chatId of targets) {
    try {
      await ctx.telegram.sendMessage(chatId, broadcastTemplate(config.botName, msg), { parse_mode: "Markdown" });
      sent++;
    } catch (e) {
      failed++;
    }
  }

  return ctx.replyWithMarkdown(broadcastStatus.done(sent, failed));
});

bot.on("message", async (ctx) => {
  const chat = ctx.chat;
  const text = ctx.message.text;
  if (!text) return;

  if (isGroup(chat)) {
    await saveGroup(chat);
    if (!shouldReplyInGroup(ctx, botUsername)) return;
  } else {
    await saveUser(ctx.from);
  }

  const reply = await askAI(text);
  return ctx.reply(reply);
});

bot.launch().then(() => console.log("Bot started 😚💖"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
