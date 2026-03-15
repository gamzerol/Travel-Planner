export interface TimeSlot {
  activity: string;
  location: string;
  lat: number;
  lng: number;
}

export interface Day {
  day: number;
  morning: TimeSlot;
  afternoon: TimeSlot;
  evening: TimeSlot;
}

export interface Itinerary {
  city: string;
  days: Day[];
}

export interface SavedTrip {
  id: string;
  city: string;
  days: number;
  interests: string[];
  itinerary: Itinerary;
  createdAt: string;
}
