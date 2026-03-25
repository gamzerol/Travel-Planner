export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, city } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a helpful travel assistant specializing in ${city || "travel"}. 
            Give short, practical, friendly answers. Max 3 sentences per response.`,
            },
            ...messages,
          ],
          temperature: 0.8,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: `Groq error: ${response.status}` },
        { status: 500 },
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return NextResponse.json({ message: content });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error?.message || "Yanıt alınamadı" },
      { status: 500 },
    );
  }
}
