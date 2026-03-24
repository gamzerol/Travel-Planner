import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " city travel")}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    const data = await res.json();
    const photo = data.results?.[0];

    if (!photo) {
      return NextResponse.json({ url: null });
    }

    return NextResponse.json({
      url: photo.urls.regular,
      blur_hash: photo.blur_hash,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
