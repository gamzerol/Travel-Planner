export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { city, days, interests } = await req.json();

    if (!city || !days || !interests?.length) {
      return NextResponse.json(
        { error: "city, days ve interests zorunludur" },
        { status: 400 },
      );
    }

    const prompt = `
      Create a ${days}-day travel itinerary for ${city}.
      Traveler interests: ${interests.join(", ")}.

      Rules:
      - Return ONLY valid JSON, no extra text
      - lat/lng must be real coordinates for ${city}
      - Activities must match the interests
      - Each activity description max 6 words

      Required JSON format:
      {
        "city": "${city}",
        "days": [
          {
            "day": 1,
            "morning":   { "activity": "...", "location": "...", "lat": 0.0, "lng": 0.0 },
            "afternoon": { "activity": "...", "location": "...", "lat": 0.0, "lng": 0.0 },
            "evening":   { "activity": "...", "location": "...", "lat": 0.0, "lng": 0.0 }
          }
        ]
      }
    `;

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
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
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

    if (!content) {
      return NextResponse.json(
        { error: "Model boş yanıt döndü" },
        { status: 500 },
      );
    }

    const itinerary = JSON.parse(content);
    return NextResponse.json(itinerary);
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: error?.message || "Itinerary oluşturulamadı" },
      { status: 500 },
    );
  }
}
