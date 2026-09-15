package models

import (
	"errors"
	"fmt"
	"time"
)

// TimeSlot represents a fixed daily time window for bookings.
type TimeSlot struct {
	ID        int64     `json:"id" db:"id"`
	StartTime string    `json:"start_time" db:"start_time"` // Format: "HH:MM" (e.g., "08:00")
	EndTime   string    `json:"end_time" db:"end_time"`     // Format: "HH:MM" (e.g., "09:00")
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// CreateTimeSlotRequest represents the payload for defining a new time slot.
type CreateTimeSlotRequest struct {
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

// FormatDisplay returns a user-friendly string representation of the slot (e.g., "08:00 - 09:00").
func (ts *TimeSlot) FormatDisplay() string {
	return fmt.Sprintf("%s - %s", ts.StartTime, ts.EndTime)
}

// Validate checks time formatting and verifies start time comes before end time.
func (req *CreateTimeSlotRequest) Validate() error {
	start, err := time.Parse("15:04", req.StartTime)
	if err != nil {
		return errors.New("start_time must be in HH:MM format (e.g., 08:00)")
	}

	end, err := time.Parse("15:04", req.EndTime)
	if err != nil {
		return errors.New("end_time must be in HH:MM format (e.g., 09:00)")
	}

	if !start.Before(end) {
		return errors.New("start_time must be before end_time")
	}

	return nil
}