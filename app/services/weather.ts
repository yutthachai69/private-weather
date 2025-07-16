import { WeatherData, OpenWeatherResponse, ForecastResponse } from "../types/weather";

// สามารถใช้ process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY ได้ถ้าตั้งค่า .env แล้ว
const API_KEY = "fcb1d9a55ecbed33754bbe3e4c68a314";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function fetchWeather(city: string): Promise<WeatherData> {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=th`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("ไม่พบข้อมูลอากาศของเมืองนี้");
  const data: OpenWeatherResponse = await res.json();
  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
}

export async function fetchWeatherByLatLon(lat: number, lon: number): Promise<WeatherData> {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("ไม่พบข้อมูลอากาศของจุดนี้");
  const data: OpenWeatherResponse = await res.json();
  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
}

export async function fetchForecastByLatLon(lat: number, lon: number): Promise<ForecastResponse> {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("ไม่พบข้อมูลพยากรณ์อากาศของจุดนี้");
  return await res.json();
} 