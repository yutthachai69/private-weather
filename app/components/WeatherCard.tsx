"use client";

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  icon?: string;
  aqi?: number; // Air Quality Index
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, description, icon, aqi }) => {
  const getAQIColor = (aqi?: number) => {
    if (!aqi) return 'text-gray-500';
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    if (aqi <= 200) return 'text-red-600';
    return 'text-purple-600';
  };

  const getAQILabel = (aqi?: number) => {
    if (!aqi) return 'ไม่มีข้อมูล';
    if (aqi <= 50) return 'ดี';
    if (aqi <= 100) return 'ปานกลาง';
    if (aqi <= 150) return 'ไม่ดีต่อสุขภาพ';
    if (aqi <= 200) return 'ไม่ดี';
    return 'อันตราย';
  };

  return (
    <div className="weather-card rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center w-full max-w-xs sm:max-w-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">{city}</h2>
      {icon && (
        <img src={icon} alt={description} className="w-12 h-12 sm:w-16 sm:h-16 mb-2" />
      )}
      <div className="text-3xl sm:text-4xl font-semibold mb-1">{temperature}°C</div>
      <div className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 text-center mb-2">{description}</div>
      {aqi && (
        <div className={`text-sm font-medium ${getAQIColor(aqi)}`}>
          ฝุ่นละออง: {aqi} ({getAQILabel(aqi)})
        </div>
      )}
    </div>
  );
};

export default WeatherCard; 