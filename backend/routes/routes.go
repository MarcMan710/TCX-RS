package routes

import (
	"net/http"

	"github.com/gorilla/mux"

	"KARO-BRS/backend/internal/handlers"
	"KARO-BRS/backend/internal/middleware"
)

type RouterDeps struct {
	AuthHandler        *handlers.AuthHandler
	CourtHandler       *handlers.CourtHandler
	TimeSlotHandler    *handlers.TimeSlotHandler
	ReservationHandler *handlers.ReservationHandler

	AuthMiddleware *middleware.AuthMiddleware
	RoleMiddleware *middleware.RoleMiddleware
}

func SetupRoutes(deps RouterDeps) *mux.Router {
	r := mux.NewRouter()

	// Base API Subrouter
	api := r.PathPrefix("/api").Subrouter()

	// -------------------------------------------------------------
	// 1. Auth Routes (/api/auth)
	// -------------------------------------------------------------
	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/register", deps.AuthHandler.Register).Methods(http.MethodPost)
	auth.HandleFunc("/login", deps.AuthHandler.Login).Methods(http.MethodPost)

	// -------------------------------------------------------------
	// Protected Routes Subrouter (requires valid JWT token)
	// -------------------------------------------------------------
	protected := api.PathPrefix("").Subrouter()
	protected.Use(deps.AuthMiddleware.Authenticate)

	// -------------------------------------------------------------
	// 2. Court Routes (/api/courts)
	// -------------------------------------------------------------
	courts := protected.PathPrefix("/courts").Subrouter()
	courts.HandleFunc("", deps.CourtHandler.GetAllCourts).Methods(http.MethodGet)
	courts.HandleFunc("/{id:[0-9]+}", deps.CourtHandler.GetCourtByID).Methods(http.MethodGet)

	// Admin-only court operations
	courtsAdmin := courts.PathPrefix("").Subrouter()
	courtsAdmin.Use(deps.RoleMiddleware.RequireAdmin)
	courtsAdmin.HandleFunc("", deps.CourtHandler.CreateCourt).Methods(http.MethodPost)
	courtsAdmin.HandleFunc("/{id:[0-9]+}", deps.CourtHandler.UpdateCourt).Methods(http.MethodPut)
	courtsAdmin.HandleFunc("/{id:[0-9]+}", deps.CourtHandler.DeleteCourt).Methods(http.MethodDelete)

	// -------------------------------------------------------------
	// 3. Time Slots Routes (/api/time-slots)
	// -------------------------------------------------------------
	timeSlots := protected.PathPrefix("/time-slots").Subrouter()
	timeSlots.HandleFunc("", deps.TimeSlotHandler.GetTimeSlots).Methods(http.MethodGet)

	// Admin-only time slot operations
	timeSlotsAdmin := timeSlots.PathPrefix("").Subrouter()
	timeSlotsAdmin.Use(deps.RoleMiddleware.RequireAdmin)
	timeSlotsAdmin.HandleFunc("", deps.TimeSlotHandler.CreateTimeSlot).Methods(http.MethodPost)
	timeSlotsAdmin.HandleFunc("/{id:[0-9]+}", deps.TimeSlotHandler.UpdateTimeSlot).Methods(http.MethodPut)
	timeSlotsAdmin.HandleFunc("/{id:[0-9]+}", deps.TimeSlotHandler.DeleteTimeSlot).Methods(http.MethodDelete)

	// -------------------------------------------------------------
	// 4. Availability Routes (/api/availability)
	// -------------------------------------------------------------
	availability := protected.PathPrefix("/availability").Subrouter()
	availability.HandleFunc("", deps.ReservationHandler.CheckAvailability).Methods(http.MethodGet)

	// -------------------------------------------------------------
	// 5. Reservation Routes (/api/reservations)
	// -------------------------------------------------------------
	reservations := protected.PathPrefix("/reservations").Subrouter()
	reservations.HandleFunc("", deps.ReservationHandler.CreateReservation).Methods(http.MethodPost)
	reservations.HandleFunc("", deps.ReservationHandler.GetReservations).Methods(http.MethodGet)
	reservations.HandleFunc("/{id:[0-9]+}", deps.ReservationHandler.GetReservationByID).Methods(http.MethodGet)
	reservations.HandleFunc("/{id:[0-9]+}/cancel", deps.ReservationHandler.CancelReservation).Methods(http.MethodPost)

	return r
}
