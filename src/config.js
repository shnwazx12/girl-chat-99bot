import dotenv from "dotenv";
dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN,
  openaiKey: process.env.OPENAI_API_KEY,
  mongoUri: process.env.MONGO_URI,
  ownerId: Number(process.env.OWNER_ID || 0),
  supportChannel: process.env.SUPPORT_CHANNEL || "",
  botName: process.env.BOT_NAME || "GirlBot",
  autoDeleteMinutes: Number(process.env.AUTO_DELETE_MINUTES || 0),
};
