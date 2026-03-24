"use client";

import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useSavedTrips, SavedTrip } from "@/src/hooks/useSavedTrip";
import { Itinerary } from "@/src/types/trip";
import ItineraryPanel from "@/src/components/ItineraryPanel";
import MapPanel from "@/src/components/MapPanel";
import Link from "next/link";

export default function SavedTripsPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { trips, loading: tripsLoading, deleteTrip } = useSavedTrips(user?.id);
  const [selected, setSelected] = useState<SavedTrip | null>(null);

  // Auth yükleniyor
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#ecedf8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Giriş yapılmamış
  if (!user) {
    return (
      <div className="min-h-screen bg-[#ecedf8] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-medium text-gray-800">
          Sign in to see your trips
        </h2>
        <p className="text-sm text-gray-500">
          Your saved itineraries will appear here.
        </p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          ← Back to planner
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ecedf8]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-gray-800 hover:opacity-80 transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
          AI Travel Planner
        </Link>
        <div className="flex items-center gap-3">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-gray-600 hidden md:block">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
      </nav>

      <div className="px-4 md:px-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Saved Trips</h1>
            <p className="text-sm text-gray-500 mt-1">
              {tripsLoading
                ? "Loading..."
                : `${trips.length} trip${trips.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-indigo-500 hover:text-indigo-600 border border-indigo-100 bg-white rounded-xl px-4 py-2 transition"
          >
            + New Trip
          </Link>
        </div>

        {/* Loading */}
        {tripsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="w-24 h-4 bg-gray-200 rounded mb-3" />
                <div className="w-40 h-3 bg-gray-100 rounded mb-2" />
                <div className="w-32 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Boş state */}
        {!tripsLoading && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">🗺️</div>
            <h3 className="text-lg font-medium text-gray-700">
              No saved trips yet
            </h3>
            <p className="text-sm text-gray-400">
              Generate a trip and save it to see it here.
            </p>
            <Link
              href="/"
              className="bg-indigo-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-indigo-600 transition"
            >
              Plan a trip
            </Link>
          </div>
        )}

        {/* Trip grid */}
        {!tripsLoading && trips.length > 0 && !selected && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={() => setSelected(trip)}
                onDelete={() => deleteTrip(trip.id)}
              />
            ))}
          </div>
        )}

        {/* Seçili trip detayı */}
        {selected && (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 4L6 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to saved trips
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ItineraryPanel
                itinerary={selected.itinerary}
                interests={selected.interests}
              />
              <MapPanel itinerary={selected.itinerary} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({
  trip,
  onView,
  onDelete,
}: {
  trip: SavedTrip;
  onView: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const date = new Date(trip.created_at).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:border-indigo-100 transition group">
      {/* City header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-gray-800 text-base">{trip.city}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
          ✈️
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          🗓 {trip.days} {trip.days === 1 ? "day" : "days"}
        </span>
        <span className="text-gray-200">·</span>
        <span className="flex items-center gap-1">
          {trip.itinerary.days.length * 3} activities
        </span>
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-1.5">
        {trip.interests.map((interest) => (
          <span
            key={interest}
            className="bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-2.5 py-0.5 text-xs"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-50 mt-auto">
        <button
          onClick={onView}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2 text-xs font-medium transition"
        >
          View Trip
        </button>

        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={() => {
                onDelete();
                setConfirmDelete(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-3 py-2 text-xs font-medium transition"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl px-3 py-2 text-xs transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 text-gray-400 hover:text-red-400 rounded-xl px-3 py-2 text-xs transition"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 4h10M6 4V3h4v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
