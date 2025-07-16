"use client";

import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import LocationSelector from "./components/LocationSelector";
import Forecast from "./components/Forecast";
import { useWeather } from "./hooks/useWeather";
import { Subdistrict } from "./types/rayongLocations";

export default function Home() {
  const { weather, forecast, loading, error, getWeather, getWeatherByLatLon, getForecastByLatLon } = useWeather("ระยอง");
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
    getWeatherByLatLon(subdistrict.lat, subdistrict.lon);
    getForecastByLatLon(subdistrict.lat, subdistrict.lon);
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
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Rayong Weather App</h1>
      <LocationSelector onSelect={handleSelectLocation} />
      <SearchBar onSearch={getWeather} />
      {loading && <div className="text-blue-600">กำลังโหลดข้อมูล...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {weather && !loading && !error && (
        <>
          <WeatherCard
            city={selectedLocationName}
            temperature={weather.temperature}
            description={weather.description}
            icon={weather.icon}
          />
          {isNearby && (
            <div className="mt-2 text-xs text-yellow-400 text-center">
              * ข้อมูลอากาศนี้อาจเป็นของเมืองหรือพื้นที่ใกล้เคียงกับตำบลที่เลือก ({nearbyCity})
            </div>
          )}
        </>
      )}
      {forecast && !loading && !error && <Forecast forecast={forecast} />}
      <footer className="mt-10 text-xs text-zinc-500 dark:text-zinc-400">Powered by OpenWeatherMap API</footer>
    </div>
  );
}
