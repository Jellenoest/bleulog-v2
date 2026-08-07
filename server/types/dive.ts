export interface Dive {
  id: string;

  // Basis
  diveNumber: number;
  date: string;
  location: string;
  country: string;
  buddy: string;

  // GPS
  latitude: number;
  longitude: number;

  // Duik
  diveType: "Boot" | "Kant";

  nightDive: boolean;
  driftDive: boolean;
  altitudeDive: boolean;

  maxDepth: number;
  averageDepth: number;

  duration: number;
  safetyStop: number;

  // Water
  waterType: "Zoet" | "Zout";
  waterTemperature: number;
  visibility: number;
  current: string;

  // Materiaal
  weight: number;
  suit: string;
  cylinder: string;
  gas: string;

  startPressure: number;
  endPressure: number;

  airConsumption: number;

  // Notities
  notes: string;

  // Foto's
  photos: string[];
}