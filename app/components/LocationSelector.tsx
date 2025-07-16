"use client";
import React, { useState } from "react";
import { rayongLocations } from "../services/rayongLocations";
import { Subdistrict } from "../types/rayongLocations";

interface LocationSelectorProps {
  onSelect: (subdistrict: Subdistrict) => void;
  loading?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect, loading = false }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");

  const districts = rayongLocations.map(d => d.district);
  const subdistricts =
    rayongLocations.find(d => d.district === selectedDistrict)?.subdistricts || [];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedSubdistrict("");
  };

  const handleSubdistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubdistrict(e.target.value);
    const sub = subdistricts.find(s => s.name === e.target.value);
    if (sub) onSelect(sub);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm mb-3 sm:mb-4">
      <select
        value={selectedDistrict}
        onChange={handleDistrictChange}
        disabled={loading}
        className={`px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none text-sm sm:text-base ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <option value="">เลือกอำเภอ</option>
        {districts.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        value={selectedSubdistrict}
        onChange={handleSubdistrictChange}
        disabled={!selectedDistrict || loading}
        className={`px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none text-sm sm:text-base ${
          (!selectedDistrict || loading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <option value="">เลือกตำบล</option>
        {subdistricts.map(s => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
      {loading && (
        <div className="text-xs text-blue-600 text-center mt-1">
          กำลังโหลดข้อมูล...
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 