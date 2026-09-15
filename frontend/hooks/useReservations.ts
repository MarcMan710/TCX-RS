"use client";

import { useState, useCallback } from "react";
import reservationService, {
  AvailabilityResponse,
  CreateReservationPayload,
  ReservationDetail,
} from "@/services/reservation.service";
import { CustomerReservation } from "@/components/reservations/ReservationCard";

interface UseReservationsReturn {
  reservations: CustomerReservation[];
  availability: AvailabilityResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadAvailability: (date: string, courtId?: string) => Promise<void>;
  loadUserReservations: () => Promise<void>;
  createReservation: (payload: CreateReservationPayload) => Promise<ReservationDetail | null>;
  cancelReservation: (id: string) => Promise<boolean>;
}

export function useReservations(): UseReservationsReturn {
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch court availability matrix for a target date
   */
  const loadAvailability = useCallback(async (date: string, courtId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationService.checkAvailability({ date, courtId });
      setAvailability(data);
    } catch (err: any) {
      setError(err.message || "Failed to load court availability");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load current user's court bookings
   */
  const loadUserReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationService.getUserReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new court booking
   */
  const createReservation = async (
    payload: CreateReservationPayload
  ): Promise<ReservationDetail | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newBooking = await reservationService.createReservation(payload);
      setReservations((prev) => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      setError(err.message || "Failed to complete reservation");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cancel an existing reservation by ID
   */
  const cancelReservation = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await reservationService.cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r))
      );
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to cancel reservation");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reservations,
    availability,
    isLoading,
    isSubmitting,
    error,
    loadAvailability,
    loadUserReservations,
    createReservation,
    cancelReservation,
  };
}

export default useReservations;