import React, { useState, useEffect } from 'react';
import { 
    Search, Bell, Cloud, Wind, Droplets, MapPin, LayoutGrid, ChevronLeft,
    CloudRain, CloudSun, Sun, Cloudy, Thermometer, Settings, X, SunDim, Moon
} from 'lucide-react';

// --- Mock Data ---
// Note: Removed hardcoded text color from the current weather icon for theme compatibility
const mockWeatherData = {
    current: { city: "Hyderabad", time: "6:25 PM", temp: 24, condition: "Heavy Rain", icon: <CloudRain size={64} className="drop-shadow-lg" />, details: { pressure: 173, humidity: '92%', wind: 6, uv: 3, } },
    forecast: [ { day: "Thu", date: "25 Jul", temp: "24°/22°", icon: <CloudRain size={24} /> }, { day: "Fri", date: "26 Jul", temp: "24°/22°", icon: <CloudSun size={24} /> }, { day: "Sat", date: "27 Jul", temp: "24°/22°", icon: <CloudSun size={24} /> }, { day: "Sun", date: "28 Jul", temp: "24°/22°", icon: <Cloudy size={24} /> }, { day: "Mon", date: "29 Jul", temp: "24°/22°", icon: <CloudRain size={24} /> }, { day: "Tue", date: "30 Jul", temp: "24°/22°", icon: <Sun size={24} /> }, ],
    summary: [ { time: "Now", temp: 22, rain: 78, icon: <CloudRain size={20} /> }, { time: "7 PM", temp: 20, rain: 79, icon: <CloudRain size={20} /> }, { time: "9 PM", temp: 22, rain: 76, icon: <Cloudy size={20} /> }, { time: "11 PM", temp: 19, rain: 61, icon: <Cloudy size={20} /> }, { time: "1 AM", temp: 21, rain: 76, icon: <Cloudy size={20} /> }, { time: "3 AM", temp: 22, rain: 76, icon: <Cloudy size={20} /> }, { time: "5 AM", temp: 23, rain: 68, icon: <Cloudy size={20} /> }, { time: "7 AM", temp: 24, rain: 61, icon: <CloudSun size={20} /> }, { time: "9 AM", temp: 25, rain: 69, icon: <Sun size={20} /> }, { time: "11 AM", temp: 25, rain: 70, icon: <Sun size={20} /> }, ],
    popularCities: [ { name: "Delhi", condition: "Partly Cloudy", icon: <CloudSun size={20} /> }, { name: "Mumbai", condition: "Drizzle Rain", icon: <CloudRain size={20} /> }, { name: "Hyderabad", condition: "Light Thunders", icon: <Cloudy size={20} /> }, { name: "Bangalore", condition: "Light Thunders", icon: <Cloudy size={20} /> }, { name: "Kolkata", condition: "Mostly Sunny", icon: <Sun size={20} /> }, ]
};

// --- Reusable Glass Panel Component ---
const GlassPanel = ({ children, className = '' }) => (
    <div className={`bg-gray-500/10 dark:bg-white/10 backdrop-blur-lg rounded-3xl border border-gray-500/20 dark:border-white/20 shadow-lg ${className}`}>
        {children}
    </div>
);

// --- Settings Panel Component ---
const SettingsPanel = ({ settings, setSettings, closePanel }) => {
    const handleSettingChange = (category, value) => {
        setSettings(prev => ({ ...prev, [category]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <GlassPanel className="w-full max-w-lg p-6 text-gray-800 dark:text-white relative animate-fade-in">
                <button onClick={closePanel} className="absolute top-4 right-4 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white">
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
                                <button onClick={() => handleSettingChange('tempUnit', 'C')} className={`px-3 py-1 text-sm rounded-full ${settings.tempUnit === 'C' ? 'bg-black/20 dark:bg-white/30' : ''}`}>°C</button>
                                <button onClick={() => handleSettingChange('tempUnit', 'F')} className={`px-3 py-1 text-sm rounded-full ${settings.tempUnit === 'F' ? 'bg-black/20 dark:bg-white/30' : ''}`}>°F</button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Wind Speed</p>
                            <div className="flex space-x-1 bg-black/10 dark:bg-white/10 p-1 rounded-full border border-black/20 dark:border-white/20">
                                <button onClick={() => handleSettingChange('windUnit', 'kmh')} className={`px-3 py-1 text-sm rounded-full ${settings.windUnit === 'kmh' ? 'bg-black/20 dark:bg-white/30' : ''}`}>km/h</button>
                                <button onClick={() => handleSettingChange('windUnit', 'mph')} className={`px-3 py-1 text-sm rounded-full ${settings.windUnit === 'mph' ? 'bg-black/20 dark:bg-white/30' : ''}`}>mph</button>
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
                            <button onClick={() => handleSettingChange('theme', 'light')} className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${settings.theme === 'light' ? 'bg-black/20 dark:bg-white/30' : ''}`}><SunDim size={16}/> Light</button>
                            <button onClick={() => handleSettingChange('theme', 'dark')} className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${settings.theme === 'dark' ? 'bg-black/20 dark:bg-white/30' : ''}`}><Moon size={16}/> Dark</button>
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
                            onChange={(e) => handleSettingChange('defaultLocation', e.target.value)}
                            placeholder="Enter a city name"
                            className="flex-grow bg-black/5 dark:bg-white/10 backdrop-blur-lg rounded-full py-2 px-4 border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-white/50"
                        />
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm">Save</button>
                    </div>
                </div>
                
                {/* About Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">About Droplet</h3>
                    <p className="text-sm text-gray-600 dark:text-white/70">Version 1.0.0. Weather data powered by OpenWeatherMap.</p>
                </div>
            </GlassPanel>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [forecastDays, setForecastDays] = useState(7);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        tempUnit: 'C',
        windUnit: 'kmh',
        theme: 'dark',
        defaultLocation: 'Hyderabad',
        language: 'en'
    });
    
    // Apply theme to the body
    useEffect(() => {
        document.body.className = ''; // Clear previous theme
        if (settings.theme === 'dark') {
            document.body.classList.add('dark');
        }
    }, [settings.theme]);

    const { current, forecast, summary, popularCities } = mockWeatherData;

    // Helper to convert temperature if needed
    const displayTemp = (celsius) => {
        if (settings.tempUnit === 'F') {
            return Math.round((celsius * 9/5) + 32);
        }
        return celsius;
    };
    
    // Helper to convert wind speed
    const displayWind = (kmh) => {
        if (settings.windUnit === 'mph') {
            return (kmh / 1.609).toFixed(1);
        }
        return kmh;
    }

    return (
        <div className={`min-h-screen bg-cover bg-center text-gray-800 dark:text-white font-sans p-4 sm:p-6 lg:p-8`} style={{backgroundImage: `url('https://placehold.co/1920x1080/${settings.theme === 'dark' ? '002040' : 'a0c4ff'}/FFFFFF?text=Weather+Background')`}}>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
            
            {showSettings && <SettingsPanel settings={settings} setSettings={setSettings} closePanel={() => setShowSettings(false)} />}

            <div className="flex h-full">
                {/* --- Sidebar --- */}
                <GlassPanel className="hidden lg:flex flex-col items-center w-24 py-8">
                    <LayoutGrid size={28} className="cursor-pointer mb-10" />
                    <div className="space-y-8">
                        <MapPin size={28} className="cursor-pointer text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors" />
                        <Settings onClick={() => setShowSettings(true)} size={28} className="cursor-pointer text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors" />
                    </div>
                    <div className="flex-grow"></div>
                    <ChevronLeft size={28} className="cursor-pointer" />
                </GlassPanel>

                {/* --- Main Content --- */}
                <main className="flex-1 lg:ml-8">
                    {/* --- Header --- */}
                    <header className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Droplets size={28} className="text-blue-500 dark:text-blue-300" />
                                <h1 className="text-2xl font-bold tracking-wider">Droplet</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Bell size={24} className="cursor-pointer" />
                            <img src="https://placehold.co/40x40/FFFFFF/000000?text=U" alt="User" className="rounded-full w-10 h-10 border-2 border-gray-500/50 dark:border-white/50" />
                        </div>
                    </header>

                    {/* --- Main Grid --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            {/* Current Weather */}
                            <GlassPanel className="p-6">
                                <div className="flex items-center my-4">
                                    <div className="text-gray-800 dark:text-white">{current.icon}</div>
                                    <div className="ml-4">
                                        <p className="text-7xl font-bold">{displayTemp(current.temp)}°</p>
                                        <p className="text-xl">{current.condition}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-center mt-6">
                                    <div className="flex items-center"><Thermometer size={20} className="mr-1" /><p>{current.details.pressure} mb</p></div>
                                    <div className="flex items-center"><Droplets size={20} className="mr-1" /><p>{current.details.humidity}</p></div>
                                    <div className="flex items-center"><Wind size={20} className="mr-1" /><p>{displayWind(current.details.wind)} {settings.windUnit}</p></div>
                                </div>
                            </GlassPanel>

                            {/* Forecast */}
                            <GlassPanel className="p-6">
                                <h2 className="text-lg mb-4">Forecast</h2>
                                <div className="space-y-2">
                                    {forecast.map((day, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-gray-600 dark:text-white/70">{day.icon}</div>
                                                <p className="w-24">{day.temp}</p>
                                                <p>{day.day}, {day.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassPanel>
                        </div>

                        {/* Right Column */}
                        <GlassPanel className="p-6 xl:col-span-1">
                            <h2 className="text-lg mb-4">Popular Cities</h2>
                            <div className="space-y-4">
                                {popularCities.map((city, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-gray-600 dark:text-white/70">{city.icon}</div>
                                            <div>
                                                <p>{city.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-white/70">{city.condition}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    </div>
                </main>
            </div>
        </div>
    );
}
