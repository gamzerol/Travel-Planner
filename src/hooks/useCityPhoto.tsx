import { useEffect, useState } from "react";

interface PhotoData {
  url: string;
  credit: { name: string; link: string };
}

export function useCityPhoto(city: string) {
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/city-photo?city=${encodeURIComponent(city)}`,
        );
        const data = await res.json();
        if (data.url) setPhoto(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [city]);

  return { photo, loading };
}
