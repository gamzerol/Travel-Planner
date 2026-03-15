import { groq } from "@/src/lib/groq";
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
        - Return ONLY valid JSON, no extra text.
        - lat/lng must be real coordinates for the ${city}.
        - Activities must match the interests.
        -Eact activity description max 6 words.
        - Each day must have a morning, afternoon, and evening activity.
        - Do not include any activities that are closed on the current date.

        Reuired JSON format:
        {
        "city": "${city}",
        "days": [
          {
            "day": 1,
            "morning":   { "activity": "...", "location": "...", "lat": 0.0, "lng": 0.0 },
            "afternoon": { "activity": "...", "location": "...", "lat": 0.0, "lng": 0.0 },
            "evening":   { "activity": "...", "location": "...", "lat": 0.0, "lng": 0.0 }
          }]
        }
        `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "Model boş yanıt döndü" },
        { status: 500 },
      );
    }

    const itinerary = JSON.parse(content);
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: error || "Itinerary could not created" },
      { status: 500 },
    );
  }
}
