export type CourtStatus = "Available" | "Booked" | "Maintenance";

export interface Court {
  id: string;
  name: string;
  description: string;
  status: CourtStatus;
  hourlyRate?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}