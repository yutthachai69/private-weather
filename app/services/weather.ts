import { WeatherData, OpenWeatherResponse, ForecastResponse } from "../types/weather";

// สามารถใช้ process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY ได้ถ้าตั้งค่า .env แล้ว
const API_KEY = "fcb1d9a55ecbed33754bbe3e4c68a314";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const AIR_POLLUTION_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

// คำนวณ AQI จากข้อมูลฝุ่น
function calculateAQI(pm25: number, pm10: number): number {
  // ใช้ PM2.5 เป็นหลักในการคำนวณ AQI
  if (pm25 <= 12) return Math.round((pm25 / 12) * 50);
  if (pm25 <= 35.4) return Math.round(51 + ((pm25 - 12.1) / (35.4 - 12.1)) * 49);
  if (pm25 <= 55.4) return Math.round(101 + ((pm25 - 35.5) / (55.4 - 35.5)) * 49);
  if (pm25 <= 150.4) return Math.round(151 + ((pm25 - 55.5) / (150.4 - 55.5)) * 49);
  if (pm25 <= 250.4) return Math.round(201 + ((pm25 - 150.5) / (250.4 - 150.5)) * 49);
  return Math.round(301 + ((pm25 - 250.5) / (500 - 250.5)) * 199);
}

export async function fetchAirQuality(lat: number, lon: number): Promise<number | undefined> {
  try {
    const url = `${AIR_POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    
    if (data.list && data.list[0] && data.list[0].components) {
      const { pm2_5, pm10 } = data.list[0].components;
      if (pm2_5 !== undefined) {
        return calculateAQI(pm2_5, pm10 || pm2_5);
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=th`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("ไม่พบข้อมูลอากาศของเมืองนี้");
  const data: OpenWeatherResponse = await res.json();
  
  // ดึงข้อมูล AQI ถ้ามี
  let aqi: number | undefined;
  try {
    aqi = await fetchAirQuality(data.coord?.lat || 0, data.coord?.lon || 0);
  } catch {
    // ถ้าดึง AQI ไม่ได้ก็ไม่เป็นไร
  }
  
  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    aqi
  };
}

export async function fetchWeatherByLatLon(lat: number, lon: number): Promise<WeatherData> {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("ไม่พบข้อมูลอากาศของจุดนี้");
  const data: OpenWeatherResponse = await res.json();
  
  // ดึงข้อมูล AQI
  const aqi = await fetchAirQuality(lat, lon);
  
  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    aqi
  };
}

export async function fetchForecastByLatLon(lat: number, lon: number): Promise<ForecastResponse> {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("ไม่พบข้อมูลพยากรณ์อากาศของจุดนี้");
  return await res.json();
} 