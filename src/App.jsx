import React, { useState } from 'react';
import { 
    Search, 
    Bell, 
    Cloud, 
    Wind, 
    Droplets, 
    Sunrise, 
    Sunset, 
    MapPin,
    LayoutGrid,
    ChevronLeft,
    CloudRain,
    CloudSun,
    Sun,
    Cloudy,
    Thermometer
} from 'lucide-react';

// --- Mock Data ---
// Using static data to replicate the UI from the image
const mockWeatherData = {
    current: {
        city: "Hyderabad",
        time: "6:25 PM",
        temp: 24,
        condition: "Heavy Rain",
        icon: <CloudRain size={64} className="text-white drop-shadow-lg" />,
        details: {
            pressure: 173,
            humidity: '92%',
            wind: '6km/h',
            uv: 3,
        }
    },
    forecast: [
        { day: "Thu", date: "25 Jul", temp: "24°/22°", icon: <CloudRain size={24} className="text-gray-300" /> },
        { day: "Fri", date: "26 Jul", temp: "24°/22°", icon: <CloudSun size={24} className="text-gray-300" /> },
        { day: "Sat", date: "27 Jul", temp: "24°/22°", icon: <CloudSun size={24} className="text-gray-300" /> },
        { day: "Sun", date: "28 Jul", temp: "24°/22°", icon: <Cloudy size={24} className="text-gray-300" /> },
        { day: "Mon", date: "29 Jul", temp: "24°/22°", icon: <CloudRain size={24} className="text-gray-300" /> },
        { day: "Tue", date: "30 Jul", temp: "24°/22°", icon: <Sun size={24} className="text-gray-300" /> },
    ],
    summary: [
        { time: "Now", temp: 22, rain: 78, icon: <CloudRain size={20} /> },
        { time: "7 PM", temp: 20, rain: 79, icon: <CloudRain size={20} /> },
        { time: "9 PM", temp: 22, rain: 76, icon: <Cloudy size={20} /> },
        { time: "11 PM", temp: 19, rain: 61, icon: <Cloudy size={20} /> },
        { time: "1 AM", temp: 21, rain: 76, icon: <Cloudy size={20} /> },
        { time: "3 AM", temp: 22, rain: 76, icon: <Cloudy size={20} /> },
        { time: "5 AM", temp: 23, rain: 68, icon: <Cloudy size={20} /> },
        { time: "7 AM", temp: 24, rain: 61, icon: <CloudSun size={20} /> },
        { time: "9 AM", temp: 25, rain: 69, icon: <Sun size={20} /> },
        { time: "11 AM", temp: 25, rain: 70, icon: <Sun size={20} /> },
    ],
    popularCities: [
        { name: "Delhi", condition: "Partly Cloudy", icon: <CloudSun size={20} /> },
        { name: "Mumbai", condition: "Drizzle Rain", icon: <CloudRain size={20} /> },
        { name: "Hyderabad", condition: "Light Thunders", icon: <Cloudy size={20} /> },
        { name: "Bangalore", condition: "Light Thunders", icon: <Cloudy size={20} /> },
        { name: "Kolkata", condition: "Mostly Sunny", icon: <Sun size={20} /> },
    ]
};

// --- Reusable Glass Panel Component ---
const GlassPanel = ({ children, className = '' }) => (
    <div className={`bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-lg ${className}`}>
        {children}
    </div>
);

// --- Main App Component ---
export default function App() {
    const [forecastDays, setForecastDays] = useState(7);
    const { current, forecast, summary, popularCities } = mockWeatherData;

    return (
        <div className="min-h-screen bg-cover bg-center text-white font-sans p-4 sm:p-6 lg:p-8" style={{backgroundImage: "url('https://placehold.co/1920x1080/004080/FFFFFF?text=Blue+Sky+Background')"}}>
            {/* Floating Clouds for decoration */}
            <Cloud size={150} className="absolute top-10 -left-10 text-white/20 animate-pulse" />
            <Cloud size={100} className="absolute top-20 right-5 text-white/20 animate-pulse delay-1000" />
            
            <div className="flex h-full">
                {/* --- Sidebar --- */}
                <GlassPanel className="hidden lg:flex flex-col items-center w-24 py-8 space-y-8">
                    <LayoutGrid size={28} className="cursor-pointer" />
                    <div className="flex-grow"></div>
                    <ChevronLeft size={28} className="cursor-pointer" />
                </GlassPanel>

                {/* --- Main Content --- */}
                <main className="flex-1 lg:ml-8">
                    {/* --- Header --- */}
                    <header className="flex justify-between items-center mb-8">
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <input 
                                type="text"
                                placeholder="Search for location"
                                className="w-full bg-white/10 backdrop-blur-lg rounded-full py-3 pl-12 pr-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <div className="flex items-center space-x-6">
                            <Bell size={24} className="cursor-pointer" />
                            <img src="https://placehold.co/40x40/FFFFFF/000000?text=U" alt="User" className="rounded-full w-10 h-10 border-2 border-white/50" />
                        </div>
                    </header>

                    {/* --- Main Grid --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* --- Left Column --- */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Current Weather & Map */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <GlassPanel className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-lg">Current Weather</p>
                                            <p className="text-sm text-white/70">{current.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center my-4">
                                        {current.icon}
                                        <div className="ml-4">
                                            <p className="text-7xl font-bold">{current.temp}°</p>
                                            <p className="text-xl">{current.condition}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-center mt-6">
                                        <div className="flex items-center"><Thermometer size={20} className="mr-1" /><p>{current.details.pressure}</p></div>
                                        <div className="flex items-center"><Droplets size={20} className="mr-1" /><p>{current.details.humidity}</p></div>
                                        <div className="flex items-center"><Wind size={20} className="mr-1" /><p>{current.details.wind}</p></div>
                                        <div className="flex items-center"><Sun size={20} className="mr-1" /><p>{current.details.uv}</p></div>
                                    </div>
                                </GlassPanel>
                                <GlassPanel className="p-2">
                                    {/* Placeholder for Map */}
                                    <div className="w-full h-full rounded-2xl bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/600x400/CCCCCC/000000?text=Map+Placeholder')"}}>
                                        <div className="flex justify-end p-4">
                                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                                                <MapPin size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </div>

                            {/* Forecast */}
                            <GlassPanel className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg">Forecast</h2>
                                    <div className="flex space-x-2 bg-white/10 p-1 rounded-full border border-white/20">
                                        <button onClick={() => setForecastDays(7)} className={`px-4 py-1 rounded-full ${forecastDays === 7 ? 'bg-white/30' : ''}`}>7 Days</button>
                                        <button onClick={() => setForecastDays(30)} className={`px-4 py-1 rounded-full ${forecastDays === 30 ? 'bg-white/30' : ''}`}>30 Days</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {forecast.map((day, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/10">
                                            <div className="flex items-center space-x-4">
                                                {day.icon}
                                                <p className="w-24">{day.temp}</p>
                                                <p>{day.day}, {day.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassPanel>

                            {/* Summary */}
                            <GlassPanel className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg">Summary</h2>
                                    <div className="flex space-x-2 text-sm text-white/70">
                                        <p className="cursor-pointer text-white font-semibold">Summary</p>
                                        <p className="cursor-pointer">Hourly</p>
                                        <p className="cursor-pointer">More Details</p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-center overflow-x-auto space-x-4 py-4">
                                    {summary.map((hour, index) => (
                                        <div key={index} className="flex-shrink-0 flex flex-col items-center space-y-2">
                                            <p className="text-sm">{hour.time}</p>
                                            <div className="h-24 w-1 bg-white/20 rounded-full relative">
                                                <div className="absolute bottom-0 w-full bg-blue-400 rounded-full" style={{height: `${hour.temp * 3}%`}}></div>
                                            </div>
                                            <p className="font-bold">{hour.temp}°</p>
                                            <div className="text-white/70">{hour.icon}</div>
                                            <p className="text-sm text-blue-300">{hour.rain}% Rain</p>
                                        </div>
                                    ))}
                                </div>
                            </GlassPanel>
                        </div>

                        {/* --- Right Column (Popular Cities) --- */}
                        <GlassPanel className="p-6 xl:col-span-1">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg">Popular Cities</h2>
                                <a href="#" className="text-sm text-white/70 hover:text-white">View more</a>
                            </div>
                            <div className="space-y-4">
                                {popularCities.map((city, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10">
                                        <div className="flex items-center space-x-3">
                                            {city.icon}
                                            <div>
                                                <p>{city.name}</p>
                                                <p className="text-sm text-white/70">{city.condition}</p>
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

