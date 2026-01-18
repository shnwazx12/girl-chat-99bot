import fetch from "node-fetch";
import { config } from "./config.js";

export async function askAI(prompt) {
  if (!config.openaiKey) return "AI key missing 😭💖";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.openaiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a cute, friendly, safe girl chatbot. Keep replies short, sweet, and respectful." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "Sorry baby 😭💖 I couldn't reply.";
}
