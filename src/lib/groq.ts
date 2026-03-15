import OpenAI from "openai";

export const groq = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.GROQ_API_KEY,
});
