export function isGroup(chat) {
  return chat?.type === "group" || chat?.type === "supergroup";
}

export function shouldReplyInGroup(ctx, botUsername) {
  const msg = ctx.message;
  if (!msg) return false;

  // reply if user replied to bot
  if (msg.reply_to_message?.from?.username === botUsername) return true;

  // reply if bot mentioned
  const text = msg.text || "";
  if (botUsername && text.includes(`@${botUsername}`)) return true;

  return false;
}
