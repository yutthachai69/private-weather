"use client";
import React, { useState } from "react";
import { rayongLocations } from "../services/rayongLocations";
import { Subdistrict } from "../types/rayongLocations";

interface LocationSelectorProps {
  onSelect: (subdistrict: Subdistrict) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect }) => {
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
    <div className="flex flex-col gap-2 w-full max-w-xs mb-4">
      <select
        value={selectedDistrict}
        onChange={handleDistrictChange}
        className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
      >
        <option value="">เลือกอำเภอ</option>
        {districts.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        value={selectedSubdistrict}
        onChange={handleSubdistrictChange}
        className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
        disabled={!selectedDistrict}
      >
        <option value="">เลือกตำบล</option>
        {subdistricts.map(s => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector; 