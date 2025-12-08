import { useState, useEffect } from "react";
import axios from "axios";

export const useWeather = (capital) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!capital) return;

    let cancelled = false;

    const API_KEY = import.meta.env.VITE_WEATHER_API_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${capital}&aqi=no`;

    axios
      .get(url)
      .then((response) => {
        if (!cancelled) {
          setWeather(response.data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Weather fetch error:", error);
          setWeather(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [capital]);

  return { weather };
};
