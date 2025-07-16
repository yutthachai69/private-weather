export interface Subdistrict {
  name: string;
  lat: number;
  lon: number;
}

export interface District {
  district: string;
  subdistricts: Subdistrict[];
}

export type RayongLocations = District[]; 