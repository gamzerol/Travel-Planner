"use client";

import { useState } from "react";
import { Itinerary } from "../types/trip";
import ItineraryPanel from "./ItineraryPanel";
import MapPanel from "./MapPanel";

const INTERESTS = [
  "Food",
  "Museums",
  "Nature",
  "Nightlife",
  "History",
  "Shopping",
];
const DAYS = [1, 2, 3, 4, 5, 7];

const PlannerPanel = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const generateTrip = async () => {
    if (!city.trim()) return setError("Please enter a city name");
    if (!interests.length)
      return setError("Please select at least one interest");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, days, interests }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setItinerary(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };
  const generateTripHandler = (e) => {
    console.log("Key pressed:", e.key);
    generateTrip();
  };

  return (
    <div className="grid grid-col-1 lg:grid-cols-[350px_1fr_350px] gap-3">
      <div className="rounded-2xl p-5 bg-gradient-to-b from-violet-500 to-indigo-600 text-white flex flex-col gap-4 min-h-[520px]">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-5 h-5 rounded-full bg-white/80" />
          AI Travel Planner
        </div>
        <div className="text-center mt-2">
          <h1 className="text-xl font-bold leading-snug">
            Plan your perfect trip
            <br />
            with AI ✈
          </h1>
          <p className="text-xs text-white/75 mt-2">
            Create personalized travel itineraries in seconds.
          </p>
        </div>
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={generateTripHandler}
          className="bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 text-sm placeholder-white/60 outline-none focus:bg-white/25 transition"
        />
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white/25 transition appearance-none cursor-pointer"
        >
          {DAYS.map((d) => (
            <option key={d} value={d} className="text-gray-800">
              {d} {d === 1 ? "Day" : "Days"}
            </option>
          ))}
        </select>
        <div>
          <p className="text-xs text-white/75 mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  interests.includes(interest)
                    ? "bg-white text-indigo-600 border-white font-medium"
                    : "bg-white/15 border-white/30 text-white"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-200 bg-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={generateTrip}
          disabled={loading}
          className="mt-auto bg-white text-indigo-600 font-medium rounded-xl py-3 text-sm hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate My Trip"}
        </button>

        <p className="text-xs text-center text-white/60">
          ⭐ 10,000+ AI generated trips
        </p>
      </div>
      {itinerary ? (
        <ItineraryPanel itinerary={itinerary} interests={interests} />
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 flex items-center justify-center min-h-[520px]">
          <div className="text-center text-gray-400">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-sm">
              {loading
                ? "Creating your itinerary..."
                : "Your itinerary will appear here"}
            </p>
          </div>
        </div>
      )}

      {itinerary ? (
        <MapPanel itinerary={itinerary} />
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 flex items-center justify-center min-h-[520px]">
          <div className="text-center text-gray-400">
            <div className="text-5xl mb-4">📍</div>
            <p className="text-sm">Map will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerPanel;
