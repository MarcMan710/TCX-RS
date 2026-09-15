"use client";

import { useState, useEffect, useCallback } from "react";
import courtService, { CreateCourtPayload, UpdateCourtPayload } from "@/services/court.service";
import { Court } from "@/types/court";

interface UseCourtsReturn {
  courts: Court[];
  isLoading: boolean;
  error: string | null;
  fetchCourts: () => Promise<void>;
  createCourt: (payload: CreateCourtPayload) => Promise<Court | null>;
  updateCourt: (id: string, payload: UpdateCourtPayload) => Promise<Court | null>;
  deleteCourt: (id: string) => Promise<boolean>;
}

export function useCourts(autoFetch: boolean = true): UseCourtsReturn {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courtService.getAllCourts();
      setCourts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load courts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCourts();
    }
  }, [autoFetch, fetchCourts]);

  const createCourt = async (payload: CreateCourtPayload): Promise<Court | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newCourt = await courtService.createCourt(payload);
      setCourts((prev) => [...prev, newCourt]);
      return newCourt;
    } catch (err: any) {
      setError(err.message || "Failed to create court");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourt = async (id: string, payload: UpdateCourtPayload): Promise<Court | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await courtService.updateCourt(id, payload);
      setCourts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update court");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourt = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await courtService.deleteCourt(id);
      setCourts((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete court");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courts,
    isLoading,
    error,
    fetchCourts,
    createCourt,
    updateCourt,
    deleteCourt,
  };
}

export default useCourts;