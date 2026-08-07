const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Buddy = {
  id: string;

  firstName: string;
  lastName: string;

  nickName: string;
  birthDate: string;

  phone: string;
  email: string;

  certificationAgency: string;
  certificationLevel: string;

  nitrox: boolean;

  totalDives: number;

  notes: string;
};

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();

    console.error(
      "Buddy API fout:",
      response.status,
      text
    );

    throw new Error(text || "API fout");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getBuddies(): Promise<Buddy[]> {
  return request("/buddies");
}

export function createBuddy(
  buddy: Omit<Buddy, "id">
): Promise<Buddy> {
  return request("/buddies", {
    method: "POST",
    body: JSON.stringify(buddy),
  });
}

export function updateBuddy(
  id: string,
  buddy: Partial<Buddy>
): Promise<Buddy> {
  return request(`/buddies/${id}`, {
    method: "PUT",
    body: JSON.stringify(buddy),
  });
}

export async function deleteBuddy(
  id: string
): Promise<void> {
  await request(`/buddies/${id}`, {
    method: "DELETE",
  });
}