export type SlotAvailabilityStatus = "available" | "booked" | "disabled" | "selected";

export interface TimeSlot {
  id: string;
  startTime: string; // e.g., "08:00" or "08:00:00"
  endTime: string;   // e.g., "09:00" or "09:00:00"
  status?: SlotAvailabilityStatus;
}