import { Dive } from "@/server/types/dive";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      text || `API fout (${response.status})`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getDives(): Promise<Dive[]> {
  return request<Dive[]>("/dives");
}

export async function getDive(
  id: string
): Promise<Dive> {
  return request<Dive>(`/dives/${id}`);
}

export async function createDive(
  dive: Dive
): Promise<void> {
  await request("/dives", {
    method: "POST",
    body: JSON.stringify(dive),
  });
}

export async function updateDive(
  dive: Dive
): Promise<void> {
  await request(`/dives/${dive.id}`, {
    method: "PUT",
    body: JSON.stringify(dive),
  });
}

export async function deleteDive(
  id: string
): Promise<void> {
  await request(`/dives/${id}`, {
    method: "DELETE",
  });
}