import { Dive } from "@/server/types/dive";
import * as api from "./api";

function normalizeDive(dive: Partial<Dive>): Dive {
  return {
    id: dive.id ?? "",
    diveNumber: dive.diveNumber ?? 0,

    date: dive.date ?? "",
    location: dive.location ?? "",
    country: dive.country ?? "",
    buddy: dive.buddy ?? "",

    latitude: dive.latitude ?? 0,
    longitude: dive.longitude ?? 0,

    diveType: dive.diveType ?? "Boot",

    nightDive: dive.nightDive ?? false,
    driftDive: dive.driftDive ?? false,
    altitudeDive: dive.altitudeDive ?? false,

    // Duik
    maxDepth: dive.maxDepth ?? 0,
    averageDepth: dive.averageDepth ?? 0,

    duration: dive.duration ?? 0,
    safetyStop: dive.safetyStop ?? 0,

    // Water
    waterType: dive.waterType ?? "Zoet",
    waterTemperature: dive.waterTemperature ?? 0,
    visibility: dive.visibility ?? 0,
    current: dive.current ?? "",

    // Materiaal
    weight: dive.weight ?? 0,

    suit: dive.suit ?? "",
    cylinder: dive.cylinder ?? "",
    gas: dive.gas ?? "Lucht",

    startPressure: dive.startPressure ?? 0,
    endPressure: dive.endPressure ?? 0,

    airConsumption: dive.airConsumption ?? 0,

    // Notities
    notes: dive.notes ?? "",

    // Foto's
    photos: Array.isArray(dive.photos)
      ? dive.photos
      : [],
  };
}

export async function getDives(): Promise<Dive[]> {
  const dives = await api.getDives();
  return dives.map(normalizeDive);
}

export async function getDive(
  id: string
): Promise<Dive | undefined> {
  try {
    const dive = await api.getDive(id);
    return normalizeDive(dive);
  } catch {
    return undefined;
  }
}

export async function saveDive(
  dive: Dive
): Promise<void> {
  await api.createDive(normalizeDive(dive));
}

export async function updateDive(
  dive: Dive
): Promise<void> {
  await api.updateDive(normalizeDive(dive));
}

export async function deleteDive(
  id: string
): Promise<void> {
  await api.deleteDive(id);
}

export async function saveDives(
  dives: Dive[]
): Promise<void> {
  for (const dive of dives) {
    await api.updateDive(normalizeDive(dive));
  }
}