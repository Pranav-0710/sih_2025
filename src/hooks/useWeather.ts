import { useState, useEffect } from 'react';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
}

<<<<<<< HEAD
const YOUR_OPENWEATHER_API_KEY = '151adc601d3b773a0f00c74086151d7d'; // User's actual API key
=======
const YOUR_OPENWEATHER_API_KEY = '151adc601d3b773a0f00c74086151d7d';
>>>>>>> 84d0d0f04cf8c938288f265e1c4f5dbda1c7bb32

export const useWeather = (lat: number | null, lon: number | null) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (lat === null || lon === null) {
        setWeather(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${YOUR_OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: WeatherData = await response.json();
        setWeather(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, loading, error };
};