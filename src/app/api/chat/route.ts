import { groq } from "@/src/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, city } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful travel assistant specializing in ${city || "travel"}. 
          Give short, practical, friendly answers. Max 3 sentences per response.
          Focus on local tips, hidden gems, food recommendations, and practical advice.`,
        },
        ...messages,
      ],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    return NextResponse.json({ message: content });
  } catch (error: any) {
    console.error("Chat error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Yanıt alınamadı" },
      { status: 500 },
    );
  }
}
