package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/services"
	"KARO-BRS/backend/utils"
)

type TimeSlotHandler struct {
	timeSlotService services.TimeSlotService
}

func NewTimeSlotHandler(timeSlotService services.TimeSlotService) *TimeSlotHandler {
	return &TimeSlotHandler{
		timeSlotService: timeSlotService,
	}
}

// GetTimeSlots retrieves all available time slots (GET /api/v1/time-slots).
func (h *TimeSlotHandler) GetTimeSlots(w http.ResponseWriter, r *http.Request) {
	slots, err := h.timeSlotService.GetAll(r.Context())
	if err != nil {
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to retrieve time slots")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Time slots retrieved successfully", slots)
}

// CreateTimeSlot defines a new daily booking slot (POST /api/v1/time-slots - Admin Only).
func (h *TimeSlotHandler) CreateTimeSlot(w http.ResponseWriter, r *http.Request) {
	var req models.CreateTimeSlotRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := req.Validate(); err != nil {
		utils.WriteJSONError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	slot, err := h.timeSlotService.Create(r.Context(), &req)
	if err != nil {
		if errors.Is(err, services.ErrTimeSlotOverlap) {
			utils.WriteJSONError(w, http.StatusConflict, "Time slot overlaps with an existing slot")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to create time slot")
		return
	}

	utils.WriteJSON(w, http.StatusCreated, "Time slot created successfully", slot)
}

// UpdateTimeSlot modifies an existing slot (PUT /api/v1/time-slots/{id} - Admin Only).
func (h *TimeSlotHandler) UpdateTimeSlot(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid time slot ID")
		return
	}

	var req models.CreateTimeSlotRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := req.Validate(); err != nil {
		utils.WriteJSONError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	slot, err := h.timeSlotService.Update(r.Context(), id, &req)
	if err != nil {
		if errors.Is(err, services.ErrTimeSlotNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Time slot not found")
			return
		}
		if errors.Is(err, services.ErrTimeSlotOverlap) {
			utils.WriteJSONError(w, http.StatusConflict, "Time slot overlaps with an existing slot")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to update time slot")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Time slot updated successfully", slot)
}

// DeleteTimeSlot removes a slot (DELETE /api/v1/time-slots/{id} - Admin Only).
func (h *TimeSlotHandler) DeleteTimeSlot(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid time slot ID")
		return
	}

	err = h.timeSlotService.Delete(r.Context(), id)
	if err != nil {
		if errors.Is(err, services.ErrTimeSlotNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Time slot not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to delete time slot")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Time slot deleted successfully", nil)
}