import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase";
import { Itinerary } from "../types/trip";

export interface SavedTrip {
  id: string;
  city: string;
  days: number;
  interests: string[];
  itinerary: Itinerary;
  created_at: string;
}

export function useSavedTrips(userId: string | undefined) {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchTrips = async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("saved_trips")
      .select("*")
      .order("created_at", { ascending: false });
    setTrips(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrips();
    }, 0);
    return () => clearTimeout(timer);
  }, [userId]);

  const saveTrip = async (
    city: string,
    days: number,
    interests: string[],
    itinerary: Itinerary,
  ) => {
    if (!userId) return false;
    const { error } = await supabase.from("saved_trips").insert({
      user_id: userId,
      city,
      days,
      interests,
      itinerary,
    });
    if (!error) await fetchTrips();
    return !error;
  };

  const deleteTrip = async (id: string) => {
    await supabase.from("saved_trips").delete().eq("id", id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return { trips, loading, saveTrip, deleteTrip };
}
