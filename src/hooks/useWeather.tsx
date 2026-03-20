import { useEffect, useState } from "react";

export interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export interface WeatherData {
  days: WeatherDay[];
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code <= 49) return "🌫";
  if (code <= 59) return "🌦";
  if (code <= 69) return "🌧";
  if (code <= 79) return "❄️";
  if (code <= 84) return "🌨";
  if (code <= 99) return "⛈";
  return "🌡";
}

export function getWeatherLabel(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 2) return "Partly cloudy";
  if (code <= 3) return "Cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export function useWeather(city: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        // Önce şehri koordinata çevir
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`,
        );
        const geoData = await geoRes.json();
        const location = geoData.results?.[0];
        if (!location) return;

        // Koordinatla hava durumunu al
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=auto`,
        );
        const weatherData = await weatherRes.json();

        const days: WeatherDay[] = weatherData.daily.time.map(
          (date: string, idx: number) => ({
            date,
            maxTemp: Math.round(weatherData.daily.temperature_2m_max[idx]),
            minTemp: Math.round(weatherData.daily.temperature_2m_min[idx]),
            weatherCode: weatherData.daily.weathercode[idx],
          }),
        );

        setWeather({ days });
      } catch {
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [city]);

  return { weather, loading };
}
