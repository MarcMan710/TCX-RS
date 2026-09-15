package models

import (
	"errors"
	"time"
)

// ReservationStatus defines the current lifecycle state of a booking.
type ReservationStatus string

const (
	ReservationStatusConfirmed ReservationStatus = "confirmed"
	ReservationStatusCancelled ReservationStatus = "cancelled"
	ReservationStatusCompleted ReservationStatus = "completed"
)

// IsValid checks whether the reservation status value is recognized.
func (s ReservationStatus) IsValid() bool {
	switch s {
	case ReservationStatusConfirmed, ReservationStatusCancelled, ReservationStatusCompleted:
		return true
	default:
		return false
	}
}

// Reservation represents a court booking by a user for a specific date and time slot.
type Reservation struct {
	ID              int64             `json:"id" db:"id"`
	UserID          int64             `json:"user_id" db:"user_id"`
	CourtID         int64             `json:"court_id" db:"court_id"`
	TimeSlotID      int64             `json:"time_slot_id" db:"time_slot_id"`
	ReservationDate time.Time         `json:"reservation_date" db:"reservation_date"` // YYYY-MM-DD
	Status          ReservationStatus `json:"status" db:"status"`
	CreatedAt       time.Time         `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time         `json:"updated_at" db:"updated_at"`

	// Optional relation details populated on join queries
	User     *User     `json:"user,omitempty" db:"-"`
	Court    *Court    `json:"court,omitempty" db:"-"`
	TimeSlot *TimeSlot `json:"time_slot,omitempty" db:"-"`
}

// CreateReservationRequest represents the payload to book a court.
type CreateReservationRequest struct {
	CourtID         int64  `json:"court_id"`
	TimeSlotID      int64  `json:"time_slot_id"`
	ReservationDate string `json:"reservation_date"` // Format: "YYYY-MM-DD"
}

// UpdateReservationStatusRequest represents payload for status changes (e.g., cancelation).
type UpdateReservationStatusRequest struct {
	Status ReservationStatus `json:"status"`
}

// Validate checks incoming reservation request values.
func (req *CreateReservationRequest) Validate() error {
	if req.CourtID <= 0 {
		return errors.New("valid court_id is required")
	}
	if req.TimeSlotID <= 0 {
		return errors.New("valid time_slot_id is required")
	}

	parsedDate, err := time.Parse("2006-01-02", req.ReservationDate)
	if err != nil {
		return errors.New("reservation_date must be in YYYY-MM-DD format")
	}

	// Truncate today's date to start of day for accurate past date checking
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	if parsedDate.Before(today) {
		return errors.New("cannot make a reservation for a past date")
	}

	return nil
}

// Validate checks status update requests.
func (req *UpdateReservationStatusRequest) Validate() error {
	if !req.Status.IsValid() {
		return errors.New("invalid reservation status")
	}
	return nil
}