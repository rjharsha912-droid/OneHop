import { useEffect, useState } from "react";
import { Cloud, Droplets, Wind } from "lucide-react";
import { weatherApi, type WeatherResponse } from "@/lib/api";

const CITIES = ["Ooty", "Goa", "Mumbai", "Delhi", "Jaipur"];

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [selectedCity, setSelectedCity] = useState("Ooty");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherApi.getWeather(selectedCity);
        setWeather(data);
      } catch {
        setError("Could not load weather.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [selectedCity]);

  return (
    <div className="rounded-2xl bg-surface shadow-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">Live Weather</h2>
        <Cloud size={18} className="text-primary" />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setSelectedCity(city)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedCity === city
                ? "bg-primary text-white"
                : "bg-muted/10 text-muted"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-muted text-center py-2">Loading...</p>
      )}

      {error && (
        <p className="text-sm text-red-400 text-center py-2">{error}</p>
      )}

      {weather && !loading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={weather.icon} alt={weather.condition} className="size-12" />
            <div>
              <p className="text-2xl font-extrabold text-ink">{Math.round(weather.temperature)}°C</p>
              <p className="text-xs text-muted">{weather.description}</p>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-1 text-xs text-muted">
              <Droplets size={12} />
              <span>{weather.humidity}% humidity</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-muted">
              <Wind size={12} />
              <span>{weather.wind_speed} m/s wind</span>
            </div>
            <p className="text-xs text-muted">Feels like {Math.round(weather.feels_like)}°C</p>
          </div>
        </div>
      )}
    </div>
  );
}