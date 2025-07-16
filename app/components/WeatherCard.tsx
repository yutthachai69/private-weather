"use client";

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  icon?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, description, icon }) => {
  return (
    <div className="weather-card rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center w-full max-w-xs sm:max-w-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">{city}</h2>
      {icon && (
        <img src={icon} alt={description} className="w-12 h-12 sm:w-16 sm:h-16 mb-2" />
      )}
      <div className="text-3xl sm:text-4xl font-semibold mb-1">{temperature}°C</div>
      <div className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 text-center mb-2">{description}</div>
    </div>
  );
};

export default WeatherCard; 