package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/services"
	"KARO-BRS/backend/utils"
)

type ReservationHandler struct {
	reservationService services.ReservationService
}

func NewReservationHandler(reservationService services.ReservationService) *ReservationHandler {
	return &ReservationHandler{
		reservationService: reservationService,
	}
}

// CheckAvailability queries court availability for a specific date (GET /api/v1/reservations/availability?court_id=1&date=2026-10-01).
func (h *ReservationHandler) CheckAvailability(w http.ResponseWriter, r *http.Request) {
	courtIDStr := r.URL.Query().Get("court_id")
	dateStr := r.URL.Query().Get("date")

	if courtIDStr == "" || dateStr == "" {
		utils.WriteJSONError(w, http.StatusBadRequest, "Query params court_id and date are required")
		return
	}

	courtID, err := strconv.ParseInt(courtIDStr, 10, 64)
	if err != nil || courtID <= 0 {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid court_id parameter")
		return
	}

	slots, err := h.reservationService.CheckAvailability(r.Context(), courtID, dateStr)
	if err != nil {
		if errors.Is(err, services.ErrCourtNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Court not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to check slot availability")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Availability retrieved successfully", slots)
}

// CreateReservation books a slot (POST /api/v1/reservations).
func (h *ReservationHandler) CreateReservation(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int64)
	if !ok || userID <= 0 {
		utils.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized request")
		return
	}

	var req models.CreateReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := req.Validate(); err != nil {
		utils.WriteJSONError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	reservation, err := h.reservationService.CreateReservation(r.Context(), userID, &req)
	if err != nil {
		h.handleReservationError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, "Reservation created successfully", reservation)
}

// GetReservations lists reservations based on user context (GET /api/v1/reservations).
// Admin gets all reservations; regular customer gets only their own.
func (h *ReservationHandler) GetReservations(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int64)
	if !ok {
		utils.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized request")
		return
	}

	role, _ := r.Context().Value("userRole").(string)

	var reservations []*models.Reservation
	var err error

	if role == string(models.RoleAdmin) {
		reservations, err = h.reservationService.GetAllReservations(r.Context())
	} else {
		reservations, err = h.reservationService.GetUserReservations(r.Context(), userID)
	}

	if err != nil {
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to fetch reservations")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Reservations retrieved successfully", reservations)
}

// GetReservationByID retrieves a single reservation (GET /api/v1/reservations/{id}).
func (h *ReservationHandler) GetReservationByID(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int64)
	if !ok {
		utils.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized request")
		return
	}

	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid reservation ID")
		return
	}

	role, _ := r.Context().Value("userRole").(string)
	reservation, err := h.reservationService.GetReservationByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, services.ErrReservationNotFound) {
			utils.WriteJSONError(w, http.StatusNotFound, "Reservation not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to fetch reservation")
		return
	}

	// Restrict non-admin users from viewing other users' reservations
	if role != string(models.RoleAdmin) && reservation.UserID != userID {
		utils.WriteJSONError(w, http.StatusForbidden, "Access denied")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Reservation retrieved successfully", reservation)
}

// CancelReservation cancels a booking (PATCH /api/v1/reservations/{id}/cancel).
func (h *ReservationHandler) CancelReservation(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int64)
	if !ok {
		utils.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized request")
		return
	}

	id, err := parseIDFromPath(r.URL.Path)
	if err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid reservation ID")
		return
	}

	role, _ := r.Context().Value("userRole").(string)
	isAdmin := role == string(models.RoleAdmin)

	err = h.reservationService.CancelReservation(r.Context(), id, userID, isAdmin)
	if err != nil {
		h.handleReservationError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, "Reservation cancelled successfully", nil)
}

// Centrally maps domain errors from service layer to appropriate HTTP status responses.
func (h *ReservationHandler) handleReservationError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, services.ErrReservationNotFound):
		utils.WriteJSONError(w, http.StatusNotFound, "Reservation not found")
	case errors.Is(err, services.ErrSlotAlreadyBooked):
		utils.WriteJSONError(w, http.StatusConflict, "The selected court and time slot is already booked for this date")
	case errors.Is(err, services.ErrCourtNotAvailable):
		utils.WriteJSONError(w, http.StatusBadRequest, "Court is under maintenance or inactive")
	case errors.Is(err, services.ErrUnauthorizedAccess):
		utils.WriteJSONError(w, http.StatusForbidden, "You do not have permission to modify this reservation")
	case errors.Is(err, services.ErrCannotCancelPastReservation):
		utils.WriteJSONError(w, http.StatusBadRequest, "Cannot cancel a reservation on or after the booking date")
	default:
		utils.WriteJSONError(w, http.StatusInternalServerError, "An unexpected reservation error occurred")
	}
}
