export function startMessage(botName) {
  return `Hii baby 😚💖\nI’m *${botName}* ✨\nJust type anything… I’m here for you 💌`;
}

export function helpMessage() {
  return `Hii jaan 😚💖\n\nCommands:\n/start\n/help\n/broadcast <msg> (Owner only)`;
}

export function broadcastTemplate(botName, msg) {
  return `💖 *Heyy Cutiee Update Time!* 💖\n\n${msg}\n\nStay safe & keep smiling jaan 😚💞✨\n— *${botName}* 👧🏻🎀`;
}

export const broadcastStatus = {
  started: "Okk jaan 😚💖\nBroadcast sending started… 📣✨",
  done: (sent, failed) => `Yayyy donee 😚🎀💖\nBroadcast sent successfully ✨📣\n✅ Sent: *${sent}*\n❌ Failed: *${failed}*`,
  notOwner: "Umm nooo 😤💖\nOnly my owner can use this command 👑✨",
  empty: "Oopsiee 🥺💔\nPlease write message like: /broadcast Hello 😚",
};
