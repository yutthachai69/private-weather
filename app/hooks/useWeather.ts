"use client";
import { useState } from "react";
import { WeatherData, ForecastResponse } from "../types/weather";
import { fetchWeather, fetchWeatherByLatLon, fetchForecastByLatLon } from "../services/weather";

const CACHE_EXPIRE_HOURS = 72; // 3 วัน

function getCacheKey(type: "weather" | "forecast", lat: number, lon: number) {
  return `cache_${type}_${lat}_${lon}`;
}

function saveCache(type: "weather" | "forecast", lat: number, lon: number, data: unknown) {
  const key = getCacheKey(type, lat, lon);
  const value = JSON.stringify({ data, ts: Date.now() });
  localStorage.setItem(key, value);
}

function loadCache(type: "weather" | "forecast", lat: number, lon: number): unknown | null {
  const key = getCacheKey(type, lat, lon);
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    const { data, ts } = JSON.parse(value);
    if (Date.now() - ts > CACHE_EXPIRE_HOURS * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeather(data);
      setForecast(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByLatLon = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    // ลองโหลด cache ก่อน
    const cached = loadCache("weather", lat, lon) as WeatherData | null;
    if (cached) {
      setWeather(cached);
      setLoading(false);
      return;
    }
    try {
      const data = await fetchWeatherByLatLon(lat, lon);
      setWeather(data);
      saveCache("weather", lat, lon, data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getForecastByLatLon = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    // ลองโหลด cache ก่อน
    const cached = loadCache("forecast", lat, lon) as ForecastResponse | null;
    if (cached) {
      setForecast(cached);
      setLoading(false);
      return;
    }
    try {
      const data = await fetchForecastByLatLon(lat, lon);
      setForecast(data);
      saveCache("forecast", lat, lon, data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันใหม่สำหรับเรียก weather และ forecast พร้อมกัน
  const getWeatherAndForecast = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    // ตรวจสอบ cache ก่อน
    const cachedWeather = loadCache("weather", lat, lon) as WeatherData | null;
    const cachedForecast = loadCache("forecast", lat, lon) as ForecastResponse | null;
    
    // แสดงข้อมูลจาก cache ทันทีถ้ามี
    if (cachedWeather) {
      setWeather(cachedWeather);
    }
    if (cachedForecast) {
      setForecast(cachedForecast);
    }
    
    // ถ้ามี cache ทั้งคู่แล้ว ให้หยุดโหลด
    if (cachedWeather && cachedForecast) {
      setLoading(false);
      return;
    }
    
    try {
      // เรียก API เฉพาะที่ไม่มี cache
      const promises = [];
      if (!cachedWeather) {
        promises.push(fetchWeatherByLatLon(lat, lon));
      }
      if (!cachedForecast) {
        promises.push(fetchForecastByLatLon(lat, lon));
      }
      
      const results = await Promise.all(promises);
      
      let weatherData = cachedWeather;
      let forecastData = cachedForecast;
      
      if (!cachedWeather) {
        weatherData = results.shift() as WeatherData;
        setWeather(weatherData);
        saveCache("weather", lat, lon, weatherData);
      }
      
      if (!cachedForecast) {
        forecastData = results.shift() as ForecastResponse;
        setForecast(forecastData);
        saveCache("forecast", lat, lon, forecastData);
      }
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      // ไม่ reset state ถ้ามี cache อยู่แล้ว
      if (!cachedWeather) setWeather(null);
      if (!cachedForecast) setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return { 
    weather, 
    forecast, 
    loading, 
    error, 
    getWeather, 
    getWeatherByLatLon, 
    getForecastByLatLon,
    getWeatherAndForecast 
  };
} 