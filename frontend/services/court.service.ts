import { api } from "./api";
import { Court, CourtStatus } from "@/types/court";

/**
 * Payload data structures for Court administrative operations
 */
export interface CreateCourtPayload {
  name: string;
  description: string;
  status?: CourtStatus;
  hourlyRate?: number;
  imageUrl?: string;
}

export interface UpdateCourtPayload {
  name?: string;
  description?: string;
  status?: CourtStatus;
  hourlyRate?: number;
  imageUrl?: string;
}

export const courtService = {
  /**
   * Retrieve all courts (Public)
   */
  async getAllCourts(): Promise<Court[]> {
    return await api.get<Court[]>("/courts");
  },

  /**
   * Retrieve a single court by ID (Public)
   */
  async getCourtById(id: string): Promise<Court> {
    return await api.get<Court>(`/courts/${id}`);
  },

  /**
   * Create a new court (Admin only)
   */
  async createCourt(payload: CreateCourtPayload): Promise<Court> {
    return await api.post<Court>("/courts", payload);
  },

  /**
   * Update court information or status (Admin only)
   */
  async updateCourt(id: string, payload: UpdateCourtPayload): Promise<Court> {
    return await api.put<Court>(`/courts/${id}`, payload);
  },

  /**
   * Delete a court by ID (Admin only)
   */
  async deleteCourt(id: string): Promise<void> {
    await api.delete<void>(`/courts/${id}`);
  },
};

export default courtService;