import { User } from "./user";
import { Court } from "./court";
import { TimeSlot } from "./time-slot";

export type ReservationStatus = "Confirmed" | "Completed" | "Cancelled";

export interface Reservation {
  id: string;
  user: User;
  court: Court;
  timeSlot: TimeSlot;
  date: string; // Format: YYYY-MM-DD
  status: ReservationStatus;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}