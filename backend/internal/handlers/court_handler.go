package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/services"
	"KARO-BRS/backend/utils"
)

type CourtHandler struct {
	courtService services.CourtService
}

func NewCourtHandler(courtService services.CourtService) *CourtHandler {
	return &CourtHandler{
		courtService: courtService,
	}
}

// GetAllCourts retrieves all badminton courts (GET /api/v1/courts).
func (h *CourtHandler) GetAllCourts(w http.ResponseWriter, r *http.Request) {
	courts, err := h.courtService.GetAllCourts(r.Context())
	if err != nil {
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to fetch courts")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Courts retrieved successfully", courts)
}

// GetCourtByID retrieves a single court by its ID (GET /api/v1/courts/{id}).
func (h *CourtHandler) GetCourtByID(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid court ID")
		return
	}

	court, err := h.courtService.GetCourtByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, services.ErrCourtNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Court not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to fetch court")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Court retrieved successfully", court)
}

// CreateCourt creates a new court (POST /api/v1/courts - Admin Only).
func (h *CourtHandler) CreateCourt(w http.ResponseWriter, r *http.Request) {
	var req models.CreateCourtRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := req.Validate(); err != nil {
		utils.WriteJSONError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	court, err := h.courtService.CreateCourt(r.Context(), &req)
	if err != nil {
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to create court")
		return
	}

	utils.WriteJSON(w, http.StatusCreated, "Court created successfully", court)
}

// UpdateCourt updates existing court details (PUT /api/v1/courts/{id} - Admin Only).
func (h *CourtHandler) UpdateCourt(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid court ID")
		return
	}

	var req models.UpdateCourtRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := req.Validate(); err != nil {
		utils.WriteJSONError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	court, err := h.courtService.UpdateCourt(r.Context(), id, &req)
	if err != nil {
		if errors.Is(err, services.ErrCourtNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Court not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to update court")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Court updated successfully", court)
}

// DeleteCourt removes a court (DELETE /api/v1/courts/{id} - Admin Only).
func (h *CourtHandler) DeleteCourt(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid court ID")
		return
	}

	err = h.courtService.DeleteCourt(r.Context(), id)
	if err != nil {
		if errors.Is(err, services.ErrCourtNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Court not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to delete court")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Court deleted successfully", nil)
}

// Helper function to extract numeric ID from URL path (e.g., /api/v1/courts/5 -> 5)
func parseIDFromPath(path string) (int64, error) {
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) == 0 {
		return 0, errors.New("missing id")
	}

	idStr := parts[len(parts)-1]
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		return 0, errors.New("invalid id")
	}

	return id, nil
}