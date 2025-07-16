"use client";

// TODO: ปรับ type ให้ตรงกับข้อมูลจริงหลังจากสร้าง types/weather.ts
interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  icon?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, description, icon }) => {
  return (
    <div className="weather-card rounded-xl shadow-md p-6 flex flex-col items-center w-full max-w-xs">
      <h2 className="text-xl font-bold mb-2">{city}</h2>
      {icon && (
        <img src={icon} alt={description} className="w-16 h-16 mb-2" />
      )}
      <div className="text-4xl font-semibold mb-1">{temperature}°C</div>
      <div className="text-base text-zinc-600 dark:text-zinc-300">{description}</div>
    </div>
  );
};

export default WeatherCard; 