package models

import (
	"errors"
	"strings"
	"time"
)

// CourtStatus defines the operational state of a badminton court.
type CourtStatus string

const (
	CourtStatusAvailable   CourtStatus = "available"
	CourtStatusMaintenance CourtStatus = "maintenance"
	CourtStatusInactive    CourtStatus = "inactive"
)

// IsValid checks whether the given status is a valid CourtStatus.
func (s CourtStatus) IsValid() bool {
	switch s {
	case CourtStatusAvailable, CourtStatusMaintenance, CourtStatusInactive:
		return true
	default:
		return false
	}
}

// Court represents a badminton court entity.
type Court struct {
	ID          int64       `json:"id" db:"id"`
	Name        string      `json:"name" db:"name"`
	Description string      `json:"description" db:"description"`
	Status      CourtStatus `json:"status" db:"status"`
	CreatedAt   time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at" db:"updated_at"`
}

// CreateCourtRequest represents the payload for creating a new court.
type CreateCourtRequest struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Status      CourtStatus `json:"status"`
}

// UpdateCourtRequest represents the payload for updating an existing court.
type UpdateCourtRequest struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Status      CourtStatus `json:"status"`
}

// Validate performs input validation on court creation requests.
func (req *CreateCourtRequest) Validate() error {
	req.Name = strings.TrimSpace(req.Name)
	req.Description = strings.TrimSpace(req.Description)

	if req.Name == "" {
		return errors.New("court name is required")
	}

	// Default status to available if not explicitly provided
	if req.Status == "" {
		req.Status = CourtStatusAvailable
	}

	if !req.Status.IsValid() {
		return errors.New("invalid court status")
	}

	return nil
}

// Validate performs input validation on court update requests.
func (req *UpdateCourtRequest) Validate() error {
	req.Name = strings.TrimSpace(req.Name)
	req.Description = strings.TrimSpace(req.Description)

	if req.Name == "" {
		return errors.New("court name is required")
	}
	if !req.Status.IsValid() {
		return errors.New("invalid court status")
	}

	return nil
}