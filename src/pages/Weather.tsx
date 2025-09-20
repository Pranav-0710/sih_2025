import { useState, useEffect } from 'react';

const Weather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) {
          throw new Error('VITE_WEATHER_API_KEY is missing or incorrect in your .env file!');
        }
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather(); // Fetch weather immediately on mount
    const intervalId = setInterval(fetchWeather, 1800000); // Refresh every 30 minutes

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [lat, lon]);

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weather) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
        <span>{weather.weather[0].main === 'Clear' ? '☀️' : '☁️'}</span>
        <span>{Math.round(weather.main.temp)}°C</span>
        <span className="text-muted-foreground">{weather.weather[0].description}</span>
    </div>
  );
};

export default Weather;