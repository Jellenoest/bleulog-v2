export type Certificate = {
  id: string;
  organization: string;
  certificateName: string;
  certificateNumber: string;
  achievedDate: string;
  expiryDate: string;
  notes: string;
  imageUrl: string;
  imageStoragePath: string;
  createdAt: string;
};

export type NewCertificate = Omit<Certificate, "id" | "createdAt">;

async function jsonRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Certificaatactie mislukt.");
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export function getCertificates() {
  return jsonRequest<Certificate[]>("/api/certificates");
}

export function createCertificate(certificate: NewCertificate) {
  return jsonRequest<Certificate>("/api/certificates", {
    method: "POST",
    body: JSON.stringify(certificate),
  });
}

export function deleteCertificate(id: string) {
  return jsonRequest<void>(`/api/certificates/${id}`, { method: "DELETE" });
}

export async function uploadCertificateImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/certificates/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) throw new Error(data?.error || "Upload mislukt.");
  return data as { url: string; storagePath: string };
}
