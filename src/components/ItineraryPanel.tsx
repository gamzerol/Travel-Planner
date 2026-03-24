"use client";

import { useState } from "react";
import { Day, Itinerary } from "../types/trip";

const TIME_SLOTS = [
  { key: "morning", label: "Morning", icon: "🌤" },
  { key: "afternoon", label: "Afternoon", icon: "🏛" },
  { key: "evening", label: "Evening", icon: "🌙" },
] as const;

interface Props {
  itinerary: Itinerary;
  interests: string[];
  onSave?: () => void;
  saved?: boolean;
  canSave?: boolean;
}

const ItineraryPanel = ({
  itinerary,
  interests,
  onSave,
  saved,
  canSave,
}: Props) => {
  const [activeDay, setActiveDay] = useState(0);
  const day: Day = itinerary.days[activeDay];

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 min-h-[520px]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex-shrink-0" />
        <h2 className="font-medium text-gray-800 text-base flex-1">
          {itinerary.city} — {itinerary.days.length} Day Itinerary
        </h2>
      </div>
      {/* Interests */}
      <p className="text-xs text-gray-500">
        Interests:{" "}
        {interests.map((i, idx) => (
          <span key={i} className="text-indigo-500 font-medium">
            {i}
            {idx < interests.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      {/* Day tabs */}
      <div className="flex gap-2">
        {itinerary.days.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDay(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeDay === idx
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Day {idx + 1}
          </button>
        ))}
      </div>

      {/* Day header */}
      <h3 className="font-medium text-gray-800">Day {day.day}</h3>

      {/* Time slots */}
      <div className="flex flex-col gap-3 flex-1">
        {TIME_SLOTS.map(({ key, label, icon }) => {
          const slot = day[key];
          return (
            <div
              key={key}
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3"
            >
              <span className="text-lg mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{slot.activity}</p>
                <p className="text-xs text-indigo-400 mt-0.5">
                  📍 {slot.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="flex gap-2 pt-2 border-t border-gray-50">
        <button
          onClick={onSave}
          disabled={saved || !canSave}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition ${
            saved
              ? "bg-green-50 text-green-600 border border-green-100"
              : canSave
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saved ? "✓ Saved!" : canSave ? "Save Itinerary" : "Sign in to save"}
        </button>
        <button className="flex items-center gap-2 bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-xl px-4 py-2.5 text-xs font-medium hover:bg-indigo-100 transition">
          Ask Travel Assistant
        </button>
      </div>
    </div>
  );
};

export default ItineraryPanel;
