export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  aqi?: number; // Air Quality Index
}

export interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  components?: {
    pm2_5?: number;
    pm10?: number;
    no2?: number;
    so2?: number;
    o3?: number;
    co?: number;
  };
  list?: Array<{
    components: {
      pm2_5?: number;
      pm10?: number;
      no2?: number;
      so2?: number;
      o3?: number;
      co?: number;
    };
  }>;
}

// สำหรับ 5 day / 3 hour forecast
export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  rain?: {
    "3h"?: number;
  };
  clouds?: {
    all: number;
  };
  pop?: number; // ความน่าจะเป็นที่ฝนจะตก (0-1)
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
  };
} 