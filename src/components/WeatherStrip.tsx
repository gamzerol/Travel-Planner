import {
  WeatherData,
  getWeatherIcon,
  getWeatherLabel,
} from "../hooks/useWeather";

interface Props {
  weather: WeatherData;
  tripDays: number;
}

export default function WeatherStrip({ weather, tripDays }: Props) {
  const days = weather.days.slice(0, Math.min(tripDays, 7));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🌤</span>
        <h3 className="text-sm font-medium text-gray-800">
          Weather forecast — next {days.length} days
        </h3>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
      >
        {days.map((day, idx) => {
          const date = new Date(day.date);
          const label =
            idx === 0
              ? "Today"
              : date.toLocaleDateString("en", { weekday: "short" });

          return (
            <div
              key={day.date}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition ${
                idx === 0
                  ? "bg-indigo-50 border border-indigo-100"
                  : "bg-gray-50 border border-gray-100"
              }`}
            >
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <span className="text-2xl leading-none">
                {getWeatherIcon(day.weatherCode)}
              </span>
              <span className="text-xs font-medium text-gray-800">
                {day.maxTemp}°
              </span>
              <span className="text-xs text-gray-400">{day.minTemp}°</span>
            </div>
          );
        })}
      </div>

      {/* Detay — bugün */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
        <span className="text-lg">{getWeatherIcon(days[0].weatherCode)}</span>
        <div>
          <p className="text-xs font-medium text-gray-700">
            {getWeatherLabel(days[0].weatherCode)}
          </p>
          <p className="text-xs text-gray-400">
            {days[0].maxTemp}° high · {days[0].minTemp}° low
          </p>
        </div>
      </div>
    </div>
  );
}
