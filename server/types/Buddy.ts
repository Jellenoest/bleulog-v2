export interface Buddy {
  id: string;

  firstName: string;
  lastName: string;
  nickName: string;

  phone: string;
  email: string;

  birthDate: string;

  certificationAgency:
    | "PADI"
    | "SSI"
    | "NOB"
    | "CMAS"
    | "NAUI"
    | "Anders";

  certificationLevel: string;

  emergencyContact: string;

  notes: string;

  photo: string;

  createdAt?: string;
  updatedAt?: string;
}