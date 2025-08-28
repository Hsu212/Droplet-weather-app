import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Cloud,
  Wind,
  Droplets,
  MapPin,
  LayoutGrid,
  ChevronLeft,
  CloudRain,
  CloudSun,
  Sun,
  Cloudy,
  Thermometer,
  Settings,
  X,
  SunDim,
  Moon,
} from "lucide-react";
import axios from "axios";

// --- Weather Condition to GIF Mapping ---
const weatherGifs = {
  1000: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif", // Sunny
  1003: "https://media.giphy.com/media/xT9IgzoYQ6Y8Z7Z7Z4/giphy.gif", // Partly cloudy
  1006: "https://media.giphy.com/media/xT9IgzoYQ6Y8Z7Z7Z4/giphy.gif", // Cloudy
  1009: "https://media.giphy.com/media/xT9IgzoYQ6Y8Z7Z7Z4/giphy.gif", // Overcast
  1063: "https://media.giphy.com/media/l0Iyl55kTeh71nTWw/giphy.gif", // Patchy rain possible
  1183: "https://media.giphy.com/media/xT9IgG50fb1L2/giphy.gif", // Light rain
  1189: "https://giffiles.alphacoders.com/131/13147.gif", // Moderate rain
  1195: "https://giffiles.alphacoders.com/131/13147.gif", // Heavy rain
  1213: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif", // Light snow
  1240: "https://media.giphy.com/media/l0Iyl55kTeh71nTWw/giphy.gif", // Light rain shower
  1273: "https://media.giphy.com/media/xT9IgH2xD9q2Y/giphy.gif", // Thunderstorm
  Default: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif", // Fallback
};

// --- Reusable Glass Panel Component ---
const GlassPanel = ({ children, className = "" }) => (
  <div
    className={`bg-gray-500/10 dark:bg-white/10 backdrop-blur-lg rounded-3xl border border-gray-500/20 dark:border-white/20 shadow-lg ${className}`}
  >
    {children}
  </div>
);

// --- Settings Panel Component ---
const SettingsPanel = ({ settings, setSettings, closePanel }) => {
  const handleSettingChange = (category, value) => {
    setSettings((prev) => ({ ...prev, [category]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <GlassPanel className="w-full max-w-lg p-6 text-gray-800 dark:text-white relative animate-fade-in">
        <button
          onClick={closePanel}
          className="absolute top-4 right-4 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {/* Units Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Units</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p>Temperature</p>
              <div className="flex space-x-1 bg-black/10 dark:bg-white/10 p-1 rounded-full border border-black/20 dark:border-white/20">
                <button
                  onClick={() => handleSettingChange("tempUnit", "C")}
                  className={`px-3 py-1 text-sm rounded-full ${settings.tempUnit === "C" ? "bg-black/20 dark:bg-white/30" : ""}`}
                >
                  °C
                </button>
                <button
                  onClick={() => handleSettingChange("tempUnit", "F")}
                  className={`px-3 py-1 text-sm rounded-full ${settings.tempUnit === "F" ? "bg-black/20 dark:bg-white/30" : ""}`}
                >
                  °F
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p>Wind Speed</p>
              <div className="flex space-x-1 bg-black/10 dark:bg-white/10 p-1 rounded-full border border-black/20 dark:border-white/20">
                <button
                  onClick={() => handleSettingChange("windUnit", "kmh")}
                  className={`px-3 py-1 text-sm rounded-full ${settings.windUnit === "kmh" ? "bg-black/20 dark:bg-white/30" : ""}`}
                >
                  km/h
                </button>
                <button
                  onClick={() => handleSettingChange("windUnit", "mph")}
                  className={`px-3 py-1 text-sm rounded-full ${settings.windUnit === "mph" ? "bg-black/20 dark:bg-white/30" : ""}`}
                >
                  mph
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Appearance</h3>
          <div className="flex justify-between items-center">
            <p>Theme</p>
            <div className="flex space-x-1 bg-black/10 dark:bg-white/10 p-1 rounded-full border border-black/20 dark:border-white/20">
              <button
                onClick={() => handleSettingChange("theme", "light")}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${settings.theme === "light" ? "bg-black/20 dark:bg-white/30" : ""}`}
              >
                <SunDim size={16} /> Light
              </button>
              <button
                onClick={() => handleSettingChange("theme", "dark")}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${settings.theme === "dark" ? "bg-black/20 dark:bg-white/30" : ""}`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>
        </div>

        {/* Default Location Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Default Location</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.defaultLocation}
              onChange={(e) =>
                handleSettingChange("defaultLocation", e.target.value)
              }
              placeholder="Enter a city name"
              className="flex-grow bg-black/5 dark:bg-white/10 backdrop-blur-lg rounded-full py-2 px-4 border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-white/50"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              Save
            </button>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">About Droplet</h3>
          <p className="text-sm text-gray-600 dark:text-white/70">
            Version 1.0.0. Weather data powered by WeatherAPI.com.
          </p>
        </div>
      </GlassPanel>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://placehold.co/1920x1080/002040/FFFFFF?text=Weather+Background')",
      }}
    >
      <GlassPanel className="w-full max-w-md p-8 text-white animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplets size={32} className="text-blue-300" />
            <h1 className="text-3xl font-bold tracking-wider">Droplet</h1>
          </div>
          <p className="text-white/70">
            {isSigningUp
              ? "Create an account to get started"
              : "Welcome back! Please sign in."}
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          {isSigningUp && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-white/10 backdrop-blur-lg rounded-full py-2 px-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-white/10 backdrop-blur-lg rounded-full py-2 px-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-white/10 backdrop-blur-lg rounded-full py-2 px-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-colors"
          >
            {isSigningUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-white/70">
            {isSigningUp
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="font-semibold text-blue-300 hover:text-blue-400 ml-2"
            >
              {isSigningUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </GlassPanel>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [forecastDays, setForecastDays] = useState(7);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manages login state
  const [settings, setSettings] = useState({
    tempUnit: "C",
    windUnit: "kmh",
    theme: "dark",
    defaultLocation: "Hyderabad",
    language: "en",
  });
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Apply iOS-style font and theme
  useEffect(() => {
    // Load Inter font (SF Pro fallback)
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Apply theme
    document.body.className = settings.theme === "dark" ? "dark" : "";

    return () => {
      document.head.removeChild(link);
    };
  }, [settings.theme]);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async (query) => {
      try {
        const apiKey = "b486c6fc4ba64b349ba63014252808"; // Replace with your WeatherAPI.com API key
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=${forecastDays}&aqi=no&alerts=no`,
        );
        const data = response.data;

        // Current weather
        const current = {
          city: data.location.name,
          time: data.location.localtime.split(" ")[1],
          temp: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: (
            <img
              src={
                weatherGifs[data.current.condition.code] || weatherGifs.Default
              }
              alt={data.current.condition.text}
              className="w-16 h-16 drop-shadow-lg"
            />
          ),
          details: {
            pressure: data.current.pressure_mb,
            humidity: `${data.current.humidity}%`,
            wind: data.current.wind_kph,
            uv: data.current.uv,
          },
        };

        // Forecast
        const forecast = data.forecast.forecastday
          .slice(0, forecastDays)
          .map((day) => ({
            day: new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            date: new Date(day.date).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            }),
            temp: `${Math.round(day.day.maxtemp_c)}°/${Math.round(day.day.mintemp_c)}°`,
            icon: (
              <img
                src={weatherGifs[day.day.condition.code] || weatherGifs.Default}
                alt={day.day.condition.text}
                className="w-6 h-6"
              />
            ),
          }));

        // Summary (hourly)
        const summary = data.forecast.forecastday[0].hour
          .slice(0, 10)
          .map((hour) => ({
            time: hour.time.split(" ")[1],
            temp: Math.round(hour.temp_c),
            rain: hour.chance_of_rain,
            icon: (
              <img
                src={weatherGifs[hour.condition.code] || weatherGifs.Default}
                alt={hour.condition.text}
                className="w-5 h-5"
              />
            ),
          }));

        // Popular cities
        const cities = ["Delhi", "Mumbai", "Hyderabad", "Bangalore", "Kolkata"];
        const popularCities = await Promise.all(
          cities.map(async (city) => {
            const res = await axios.get(
              `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`,
            );
            return {
              name: res.data.location.name,
              condition: res.data.current.condition.text,
              icon: (
                <img
                  src={
                    weatherGifs[res.data.current.condition.code] ||
                    weatherGifs.Default
                  }
                  alt={res.data.current.condition.text}
                  className="w-5 h-5"
                />
              ),
            };
          }),
        );

        setWeatherData({ current, forecast, summary, popularCities });
      } catch (err) {
        setError("Failed to fetch weather data");
        console.error(err);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`);
          },
          () => {
            // Fallback to default location
            fetchWeather(settings.defaultLocation);
          },
        );
      } else {
        setError("Geolocation not supported");
        fetchWeather(settings.defaultLocation);
      }
    };

    getLocation();
  }, [settings.defaultLocation, forecastDays]);

  // Helper to convert temperature
  const displayTemp = (celsius) => {
    if (settings.tempUnit === "F") {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  // Helper to convert wind speed
  const displayWind = (kmh) => {
    if (settings.windUnit === "mph") {
      return (kmh / 1.609).toFixed(1);
    }
    return kmh;
  };

  // Fallback data
  const data = weatherData || {
    current: {
      city: "Loading...",
      time: "N/A",
      temp: 0,
      condition: "N/A",
      icon: (
        <img
          src={weatherGifs.Default}
          alt="Loading"
          className="w-16 h-16 drop-shadow-lg"
        />
      ),
      details: { pressure: 0, humidity: "0%", wind: 0, uv: 0 },
    },
    forecast: [],
    summary: [],
    popularCities: [],
  };
  const { current, forecast, summary, popularCities } = data;
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div
      className={`min-h-screen bg-cover bg-center text-gray-800 dark:text-white font-sans p-4 sm:p-6 lg:p-8`}
      style={{
        backgroundImage: `url('https://placehold.co/1920x1080/${settings.theme === "dark" ? "002040" : "a0c4ff"}/FFFFFF?text=Weather+Background')`,
      }}
    >
      <style>{`
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            `}</style>

      {error && (
        <div className="fixed top-4 left-4 bg-red-500/80 text-white p-2 rounded">
          {error}
        </div>
      )}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          closePanel={() => setShowSettings(false)}
        />
      )}

      {/* Floating Clouds */}
      <Cloud
        size={150}
        className="absolute top-10 -left-10 text-gray-300/20 dark:text-white/20 animate-pulse"
      />
      <Cloud
        size={100}
        className="absolute top-20 right-5 text-gray-300/20 dark:text-white/20 animate-pulse delay-1000"
      />

      <div className="flex h-full">
        {/* --- Sidebar --- */}
        <GlassPanel className="hidden lg:flex flex-col items-center w-24 py-8">
          <LayoutGrid
            size={28}
            className="cursor-pointer mb-10 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
          />
          <div className="space-y-8">
            <MapPin
              size={28}
              className="cursor-pointer text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
            />
            <Settings
              onClick={() => setShowSettings(true)}
              size={28}
              className="cursor-pointer text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
            />
          </div>
          <div className="flex-grow"></div>
          <ChevronLeft
            size={28}
            className="cursor-pointer text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
          />
        </GlassPanel>

        {/* --- Main Content --- */}
        <main className="flex-1 lg:ml-8">
          {/* --- Header --- */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Droplets
                  size={28}
                  className="text-blue-500 dark:text-blue-300"
                />
                <h1 className="text-2xl font-bold tracking-wider">Droplet</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Bell
                size={24}
                className="cursor-pointer text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
              />
              <img
                src="https://placehold.co/40x40/FFFFFF/000000?text=U"
                alt="User"
                className="rounded-full w-10 h-10 border-2 border-gray-500/50 dark:border-white/50"
              />
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors"
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* --- Main Grid --- */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Current Weather */}
              <GlassPanel className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg">Current Weather in {current.city}</p>
                    <p className="text-sm text-gray-500 dark:text-white/70">
                      {current.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center my-4">
                  {current.icon}
                  <div className="ml-4">
                    <p className="text-7xl font-bold">
                      {displayTemp(current.temp)}°
                    </p>
                    <p className="text-xl">{current.condition}</p>
                  </div>
                </div>
                <div className="flex justify-between text-center mt-6">
                  <div className="flex items-center">
                    <Thermometer
                      size={20}
                      className="mr-1 text-gray-600 dark:text-white/70"
                    />
                    <p>{current.details.pressure} mb</p>
                  </div>
                  <div className="flex items-center">
                    <Droplets
                      size={20}
                      className="mr-1 text-gray-600 dark:text-white/70"
                    />
                    <p>{current.details.humidity}</p>
                  </div>
                  <div className="flex items-center">
                    <Wind
                      size={20}
                      className="mr-1 text-gray-600 dark:text-white/70"
                    />
                    <p>
                      {displayWind(current.details.wind)} {settings.windUnit}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Sun
                      size={20}
                      className="mr-1 text-gray-600 dark:text-white/70"
                    />
                    <p>{current.details.uv}</p>
                  </div>
                </div>
              </GlassPanel>

              {/* Forecast */}
              <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg">Forecast</h2>
                  <div className="flex space-x-2 bg-black/10 dark:bg-white/10 p-1 rounded-full border border-black/20 dark:border-white/20">
                    <button
                      onClick={() => setForecastDays(7)}
                      className={`px-4 py-1 rounded-full ${forecastDays === 7 ? "bg-black/20 dark:bg-white/30" : ""}`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setForecastDays(30)}
                      className={`px-4 py-1 rounded-full ${forecastDays === 30 ? "bg-black/20 dark:bg-white/30" : ""}`}
                    >
                      30 Days
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {forecast.length ? (
                    forecast.map((day, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <div className="flex items-center space-x-4">
                          {day.icon}
                          <p className="w-24">{day.temp}</p>
                          <p>
                            {day.day}, {day.date}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-white/70">
                      Loading forecast...
                    </p>
                  )}
                </div>
              </GlassPanel>

              {/* Summary */}
              <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg">Summary</h2>
                  <div className="flex space-x-2 text-sm text-gray-500 dark:text-white/70">
                    <p className="cursor-pointer text-gray-800 dark:text-white font-semibold">
                      Summary
                    </p>
                    <p className="cursor-pointer">Hourly</p>
                    <p className="cursor-pointer">More Details</p>
                  </div>
                </div>
                <div className="flex justify-between text-center overflow-x-auto space-x-4 py-4">
                  {summary.length ? (
                    summary.map((hour, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 flex flex-col items-center space-y-2"
                      >
                        <p className="text-sm">{hour.time}</p>
                        <div className="h-24 w-1 bg-black/20 dark:bg-white/20 rounded-full relative">
                          <div
                            className="absolute bottom-0 w-full bg-blue-400 rounded-full"
                            style={{ height: `${hour.temp * 3}%` }}
                          ></div>
                        </div>
                        <p className="font-bold">{displayTemp(hour.temp)}°</p>
                        {hour.icon}
                        <p className="text-sm text-blue-300">
                          {hour.rain}% Rain
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-white/70">
                      Loading summary...
                    </p>
                  )}
                </div>
              </GlassPanel>
            </div>

            {/* Right Column */}
            <GlassPanel className="p-6 xl:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg">Popular Cities</h2>
                <a
                  href="#"
                  className="text-sm text-gray-500 dark:text-white/70 hover:text-gray-800 dark:hover:text-white"
                >
                  View more
                </a>
              </div>
              <div className="space-y-4">
                {popularCities.length ? (
                  popularCities.map((city, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        {city.icon}
                        <div>
                          <p>{city.name}</p>
                          <p className="text-sm text-gray-500 dark:text-white/70">
                            {city.condition}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-white/70">
                    Loading cities...
                  </p>
                )}
              </div>
            </GlassPanel>
          </div>
        </main>
      </div>
    </div>
  );
}
