"use client";

import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import LocationSelector from "./components/LocationSelector";
import Forecast from "./components/Forecast";
import { useWeather } from "./hooks/useWeather";
import { Subdistrict } from "./types/rayongLocations";

export default function Home() {
  const { weather, forecast, loading, error, getWeather, getWeatherAndForecast } = useWeather();
  const [selectedLocationName, setSelectedLocationName] = useState<string>("ระยอง");
  const [isNearby, setIsNearby] = useState<boolean>(false);
  const [nearbyCity, setNearbyCity] = useState<string>("");

  useEffect(() => {
    getWeather("ระยอง");
    setSelectedLocationName("ระยอง");
    setIsNearby(false);
    setNearbyCity("");
    // eslint-disable-next-line
  }, []);

  const handleSelectLocation = (subdistrict: Subdistrict) => {
    setSelectedLocationName(subdistrict.name);
    getWeatherAndForecast(subdistrict.lat, subdistrict.lon);
  };

  // ตรวจสอบชื่อเมืองจาก API กับตำบลที่เลือก
  useEffect(() => {
    if (weather && selectedLocationName) {
      const isMatch = weather.city.replace(/\s/g, "") === selectedLocationName.replace(/\s/g, "");
      setIsNearby(!isMatch);
      setNearbyCity(isMatch ? "" : weather.city);
    }
  }, [weather, selectedLocationName]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-16 gap-4 sm:p-8 sm:gap-6 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Rayong Weather App</h1>
      <LocationSelector onSelect={handleSelectLocation} loading={loading} />
      <SearchBar onSearch={getWeather} />
      {loading && <div className="text-blue-600 text-sm sm:text-base">กำลังโหลดข้อมูล...</div>}
      {error && <div className="text-red-600 text-sm sm:text-base text-center">{error}</div>}
      {weather && !loading && !error && (
        <>
          <WeatherCard
            city={selectedLocationName}
            temperature={weather.temperature}
            description={weather.description}
            icon={weather.icon}
            aqi={weather.aqi}
          />
          {isNearby && (
            <div className="mt-2 text-xs text-yellow-400 text-center px-4">
              * ข้อมูลอากาศนี้อาจเป็นของเมืองหรือพื้นที่ใกล้เคียงกับตำบลที่เลือก ({nearbyCity})
            </div>
          )}
        </>
      )}
      {forecast && !loading && !error && <Forecast forecast={forecast} aqi={weather?.aqi} />}
      <footer className="mt-6 sm:mt-10 text-xs text-zinc-500 dark:text-zinc-400 text-center px-4">Powered by OpenWeatherMap API</footer>
    </div>
  );
}
