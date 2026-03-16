"use client";

import { useEffect, useRef, useState } from "react";
import { Itinerary } from "../types/trip";

interface Props {
  itinerary: Itinerary;
}

const MapPanel = ({ itinerary }: Props) => {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeDay, setActiveDay] = useState(0);

  const day = itinerary.days[activeDay];

  const locations = [
    { ...day.morning, label: "Morning" },
    { ...day.afternoon, label: "Afternoon" },
    { ...day.evening, label: "Evening" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView(
        [locations[0].lat, locations[0].lng],
        14,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Her lokasyon için marker ekle
      locations.forEach((loc, idx) => {
        const colors = ["#6366f1", "#f59e0b", "#10b981"];
        const icon = L.divIcon({
          html: `
            <div style="
              background: ${colors[idx]};
              width: 28px; 
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          className: "",
        });

        L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px;">
              <strong>${loc.label}</strong><br/>
              ${loc.activity}<br/>
              <span style="color:#6366f1">📍 ${loc.location}</span>
            </div>
          `);
      });

      // Tüm markerları gösterecek şekilde zoom ayarla
      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeDay, itinerary]);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 min-h-[520px]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex-shrink-0" />
        <h2 className="font-medium text-gray-800 text-base flex-1">Map</h2>
      </div>

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

      {/* Renk legend */}
      <div className="flex gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
          Morning
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          Afternoon
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Evening
        </span>
      </div>

      {/* Leaflet map */}
      <div
        ref={mapRef}
        className="flex-1 rounded-xl overflow-hidden min-h-[320px]"
        style={{ zIndex: 0 }}
      />

      {/* Location listesi */}
      <div className="flex flex-col gap-2">
        {locations.map((loc, idx) => {
          const colors = [
            "text-indigo-500",
            "text-amber-500",
            "text-emerald-500",
          ];
          return (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-gray-600"
            >
              <span className={`font-medium ${colors[idx]} w-16`}>
                {loc.label}
              </span>
              <span className="text-gray-400">—</span>
              <span>{loc.location}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapPanel;
