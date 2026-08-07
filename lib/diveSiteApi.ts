const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type DiveSite = {
  id: string;
  code: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  waterType: string;
  entryType: string;
  difficulty: string;
  maxDepth: number;
  description: string;
};

async function request<T>(
  path: string
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`
  );

  if (!response.ok) {
    throw new Error(
      "Kon duiklocaties niet ophalen."
    );
  }

  return response.json();
}

export async function searchDiveSites(
  query: string
): Promise<DiveSite[]> {

  if (!query.trim()) {
    return [];
  }

  return request<DiveSite[]>(
    `/dive-sites/search?q=${encodeURIComponent(
      query
    )}`
  );
}

export async function getDiveSites(): Promise<DiveSite[]> {
  return request<DiveSite[]>(
    "/dive-sites"
  );
}