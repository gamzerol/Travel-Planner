"use client";

import { useRef, useState } from "react";
import { Itinerary } from "../types/trip";
import ChatBubble from "./ChatBubble";
import { useCityPhoto } from "../hooks/useCityPhoto";
import ItineraryPanel from "./ItineraryPanel";
import MapPanel from "./MapPanel";

import { useWeather } from "../hooks/useWeather";
import WeatherStrip from "./WeatherStrip";

import { useSavedTrips } from "../hooks/useSavedTrip";
import { useAuth } from "../hooks/useAuth";

const INTERESTS = [
  "Food",
  "Museums",
  "Nature",
  "Nightlife",
  "History",
  "Shopping",
];
const DAYS = [1, 2, 3, 4, 5, 7];

export default function PlannerPanel() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>(["Food"]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const { trips, saveTrip, deleteTrip } = useSavedTrips(user?.id);
  const [saved, setSaved] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSave = async () => {
    if (!itinerary || !user) return;
    const success = await saveTrip(city, days, interests, itinerary);
    if (success) setSaved(true);
  };

  const generateTrip = async () => {
    if (!city.trim()) return setError("Please enter a city");
    if (!interests.length) return setError("Select at least one interest");

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, days, interests }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setItinerary(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { photo } = useCityPhoto(city);
  const { weather } = useWeather(city);

  return (
    <>
      <section
        className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden transition-all duration-700"
        style={
          photo
            ? {
                backgroundImage: `url(${photo.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {photo && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        )}
        {photo && (
          <a
            href={photo.credit.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 text-xs text-white/50 hover:text-white/80 transition z-10"
          >
            Photo by {photo.credit.name} · Unsplash
          </a>
        )}

        <div className="relative z-10 text-center mb-10">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 leading-tight transition-colors duration-500 ${
              photo ? "text-white" : "text-gray-800"
            }`}
          >
            Plan your perfect trip
            <br />
            <span
              className={
                photo
                  ? "text-white drop-shadow-lg"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500"
              }
            >
              with AI ✈
            </span>
          </h1>
          <p
            className={`text-lg transition-colors duration-500 ${
              photo ? "text-white/80" : "text-gray-500"
            }`}
          >
            Create personalized travel itineraries in seconds.
          </p>
        </div>

        <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-xl flex flex-col gap-5">
          {/* Geri kalan form içeriği — değişmeden kalıyor */}

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
              Destination
            </label>
            <input
              type="text"
              placeholder="Enter a city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateTrip()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
              Duration
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    days === d
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {d} {d === 1 ? "Day" : "Days"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
              Interests
            </label>
            <div className="flex gap-2 flex-wrap">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    interests.includes(interest)
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={generateTrip}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-medium rounded-xl py-3.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Generating your trip...
              </span>
            ) : (
              "Generate My Trip ✈"
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            ⭐ 10,000+ AI generated trips
          </p>
        </div>
      </section>
      {itinerary && (
        <section ref={resultsRef} className="px-4 md:px-8 pb-16 scroll-mt-4">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                setItinerary(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 transition"
            >
              ← New Trip
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ItineraryPanel
              itinerary={itinerary}
              interests={interests}
              onSave={handleSave}
              saved={saved}
              canSave={!!user}
            />
            <MapPanel itinerary={itinerary} />
          </div>
        </section>
      )}
      {weather && <WeatherStrip weather={weather} tripDays={days} />}
      <ChatBubble city={city} />
    </>
  );
}
