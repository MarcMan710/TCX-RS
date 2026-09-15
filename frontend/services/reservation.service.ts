import { api } from "./api";
import { CourtAvailability } from "@/components/reservations/AvailabilityGrid";
import { CustomerReservation, CustomerReservationStatus } from "@/components/reservations/ReservationCard";

/**
 * Payload structure when checking slot availability for a target date
 */
export interface CheckAvailabilityQuery {
  date: string; // Format: YYYY-MM-DD
  courtId?: string;
}

/**
 * Response structure returned by backend for court availability
 */
export interface AvailabilityResponse {
  date: string;
  timeHeaders: string[]; // e.g., ["08:00", "09:00", "10:00", ...]
  courts: CourtAvailability[];
}

/**
 * Payload required to request a court reservation
 */
export interface CreateReservationPayload {
  courtId: string;
  date: string; // Format: YYYY-MM-DD
  timeSlot: string; // e.g., "09:00"
}

/**
 * Detailed reservation structure, including administrative fields
 */
export interface ReservationDetail extends CustomerReservation {
  userId: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Filter parameters for administrative reservation listing
 */
export interface AdminReservationFilters {
  date?: string;
  courtId?: string;
  status?: CustomerReservationStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

export const reservationService = {
  /**
   * Check time slot availability for a specified date
   */
  async checkAvailability(query: CheckAvailabilityQuery): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({ date: query.date });
    if (query.courtId) {
      params.append("courtId", query.courtId);
    }
    return await api.get<AvailabilityResponse>(`/reservations/availability?${params.toString()}`);
  },

  /**
   * Create a new court reservation (Customer)
   */
  async createReservation(payload: CreateReservationPayload): Promise<ReservationDetail> {
    return await api.post<ReservationDetail>("/reservations", payload);
  },

  /**
   * Get all reservations belonging to the authenticated user (Customer)
   */
  async getUserReservations(): Promise<CustomerReservation[]> {
    return await api.get<CustomerReservation[]>("/reservations/my-reservations");
  },

  /**
   * Get specific reservation details by ID
   */
  async getReservationById(id: string): Promise<ReservationDetail> {
    return await api.get<ReservationDetail>(`/reservations/${id}`);
  },

  /**
   * Cancel an active reservation by ID (Customer / Admin)
   */
  async cancelReservation(id: string): Promise<ReservationDetail> {
    return await api.patch<ReservationDetail>(`/reservations/${id}/cancel`);
  },

  /**
   * Retrieve all reservation records across all users with optional filters (Admin only)
   */
  async getAdminReservations(filters?: AdminReservationFilters): Promise<ReservationDetail[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append("date", filters.date);
    if (filters?.courtId) params.append("courtId", filters.courtId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/admin/reservations?${queryString}` : "/admin/reservations";

    return await api.get<ReservationDetail[]>(url);
  },
};

export default reservationService;