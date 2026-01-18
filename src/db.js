import { MongoClient } from "mongodb";
import { config } from "./config.js";

let client;
let db;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(config.mongoUri);
  await client.connect();
  db = client.db("girl_ai_bot");
  await db.collection("users").createIndex({ userId: 1 }, { unique: true });
  await db.collection("groups").createIndex({ chatId: 1 }, { unique: true });
  return db;
}

export async function saveUser(user) {
  const database = await connectDB();
  if (!user?.id) return;
  await database.collection("users").updateOne(
    { userId: user.id },
    { $set: { userId: user.id, username: user.username || "", firstName: user.first_name || "", updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function saveGroup(chat) {
  const database = await connectDB();
  if (!chat?.id) return;
  await database.collection("groups").updateOne(
    { chatId: chat.id },
    { $set: { chatId: chat.id, title: chat.title || "", type: chat.type || "", updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function getAllTargets() {
  const database = await connectDB();
  const users = await database.collection("users").find({}).toArray();
  const groups = await database.collection("groups").find({}).toArray();
  return { users, groups };
}
