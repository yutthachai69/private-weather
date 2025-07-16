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

export function useWeather(defaultCity: string) {
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
      setForecast(null);
      saveCache("weather", lat, lon, data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setWeather(null);
      setForecast(null);
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

  return { weather, forecast, loading, error, getWeather, getWeatherByLatLon, getForecastByLatLon };
} 