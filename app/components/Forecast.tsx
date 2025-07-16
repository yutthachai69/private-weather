"use client";
import React, { useState } from "react";
import { ForecastResponse, ForecastItem } from "../types/weather";

interface ForecastProps {
  forecast: ForecastResponse;
}

function groupForecastByDay(forecast: ForecastResponse) {
  const days: Record<string, ForecastItem[]> = {};
  forecast.list.forEach(item => {
    const day = item.dt_txt.split(" ")[0];
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });
  return Object.entries(days).map(([date, items]) => {
    const temps = items.map(i => i.main.temp);
    const humidities = items.map(i => i.main.humidity);
    const rains = items.map(i => i.rain?.["3h"] || 0);
    const clouds = items.map(i => i.clouds?.all ?? 0);
    const icon = items[Math.floor(items.length / 2)].weather[0].icon;
    const description = items[Math.floor(items.length / 2)].weather[0].description;
    const pops = items.map(i => i.pop ?? 0);
    return {
      date,
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps)),
      icon,
      description,
      rain: rains.reduce((a, b) => a + b, 0),
      humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      clouds: Math.round(clouds.reduce((a, b) => a + b, 0) / clouds.length),
      pop: Math.round((pops.reduce((a, b) => a + b, 0) / pops.length) * 100), // %
      items
    };
  });
}

const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const daily = groupForecastByDay(forecast).slice(0, 5);
  const [modal, setModal] = useState<{ open: boolean; day?: typeof daily[0] }>({ open: false });

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-lg font-semibold mb-4">พยากรณ์อากาศ 5 วันข้างหน้า</h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {daily.map(day => (
          <div
            key={day.date}
            className="rounded-lg p-4 flex flex-col items-center cursor-pointer forecast-card transition-transform duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
            style={{ background: 'linear-gradient(135deg, #e0f7fa 60%, #b3e5fc 100%)', color: '#0d47a1', boxShadow: '0 4px 24px 0 #00bcd433', border: '1.5px solid #b3e5fc' }}
            onClick={() => setModal({ open: true, day })}
          >
            <div className="font-bold mb-1">{new Date(day.date).toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" })}</div>
            <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} className="w-12 h-12" />
            <div className="text-lg font-semibold">{day.max}° / {day.min}°C</div>
            <div className="text-xs text-zinc-600 text-center mb-1">{day.description}</div>
            <div className="text-xs text-blue-700">ฝน: {day.rain.toFixed(1)} mm</div>
            <div className="text-xs text-cyan-700">ความชื้น: {day.humidity}%</div>
            <div className="text-xs text-yellow-700">เมฆ: {day.clouds}%</div>
            <div className="text-xs text-indigo-700">โอกาสฝนตก: {day.pop}%</div>
          </div>
        ))}
      </div>
      {/* Modal Popup */}
      {modal.open && modal.day && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadein" onClick={() => setModal({ open: false })}>
          <div
            className="rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-popin"
            style={{ background: 'linear-gradient(135deg, #e0f7fa 60%, #b3e5fc 100%)', color: '#0d47a1', minWidth: 320, border: '2px solid #4fc3f7', boxShadow: '0 8px 32px 0 #00bcd444' }}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-3 right-4 text-3xl text-zinc-400 hover:text-accent-dark transition-colors duration-150" onClick={() => setModal({ open: false })} aria-label="ปิด">&times;</button>
            <div className="flex flex-col items-center mb-4">
              <img src={`https://openweathermap.org/img/wn/${modal.day.icon}@2x.png`} alt={modal.day.description} className="w-16 h-16 mb-2" />
              <div className="text-xl font-bold mb-1">{new Date(modal.day.date).toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="mb-2 text-base text-zinc-600">{modal.day.description}</div>
              <div className="mb-2">🌡️ อุณหภูมิสูงสุด: <span className="font-semibold text-accent-dark">{modal.day.max}°C</span> | ต่ำสุด: <span className="font-semibold text-accent-dark">{modal.day.min}°C</span></div>
              <div className="mb-2">🌧️ ปริมาณฝนรวม: <span className="font-semibold text-blue-700">{modal.day.rain.toFixed(1)} mm</span></div>
              <div className="mb-2">💧 ความชื้นเฉลี่ย: <span className="font-semibold text-cyan-700">{modal.day.humidity}%</span></div>
              <div className="mb-2">☁️ เมฆเฉลี่ย: <span className="font-semibold text-yellow-700">{modal.day.clouds}%</span></div>
            </div>
            <div className="mt-2 mb-2 font-semibold text-center">รายละเอียดแต่ละช่วงเวลา</div>
            <div className="max-h-48 overflow-y-auto divide-y divide-zinc-100">
              {modal.day.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm py-2">
                  <span className="w-16 font-mono text-zinc-500">{item.dt_txt.slice(11, 16)}</span>
                  <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} className="w-6 h-6" />
                  <span className="w-14">🌡️ {Math.round(item.main.temp)}°C</span>
                  <span className="w-16">🌧️ {item.rain?.["3h"] ? item.rain["3h"].toFixed(1) : "0.0"} mm</span>
                  <span className="w-14">💧 {item.main.humidity}%</span>
                  <span className="w-14">☁️ {item.clouds?.all ?? 0}%</span>
                  <span className="w-18">🌂 {item.pop !== undefined ? Math.round(item.pop * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popin { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        .animate-fadein { animation: fadein 0.25s; }
        .animate-popin { animation: popin 0.25s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </div>
  );
};

export default Forecast; 