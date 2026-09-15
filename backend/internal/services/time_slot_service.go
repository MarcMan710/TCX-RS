package services

import (
	"context"
	"errors"
	"time"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/repositories"
)

var (
	ErrTimeSlotNotFound = errors.New("time slot not found")
	ErrTimeSlotOverlap  = errors.New("time slot overlaps with an existing slot")
	ErrInvalidTimeRange = errors.New("start time must be strictly before end time")
)

// TimeSlotService defines the interface for time slot business operations.
type TimeSlotService interface {
	GetAll(ctx context.Context) ([]*models.TimeSlot, error)
	GetByID(ctx context.Context, id int64) (*models.TimeSlot, error)
	Create(ctx context.Context, req *models.CreateTimeSlotRequest) (*models.TimeSlot, error)
	Update(ctx context.Context, id int64, req *models.CreateTimeSlotRequest) (*models.TimeSlot, error)
	Delete(ctx context.Context, id int64) error
}

type timeSlotService struct {
	timeSlotRepo repositories.TimeSlotRepository
}

// NewTimeSlotService creates a new instance of TimeSlotService.
func NewTimeSlotService(timeSlotRepo repositories.TimeSlotRepository) TimeSlotService {
	return &timeSlotService{
		timeSlotRepo: timeSlotRepo,
	}
}

// GetAll retrieves all registered daily time slots.
func (s *timeSlotService) GetAll(ctx context.Context) ([]*models.TimeSlot, error) {
	return s.timeSlotRepo.GetAll(ctx)
}

// GetByID fetches a specific time slot by its ID.
func (s *timeSlotService) GetByID(ctx context.Context, id int64) (*models.TimeSlot, error) {
	slot, err := s.timeSlotRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrTimeSlotNotFound
	}
	return slot, nil
}

// Create validates time bounds and ensures no overlap before saving a new time slot.
func (s *timeSlotService) Create(ctx context.Context, req *models.CreateTimeSlotRequest) (*models.TimeSlot, error) {
	if err := s.validateTimeRange(req.StartTime, req.EndTime); err != nil {
		return nil, err
	}

	// Check if this slot conflicts with existing ones
	overlapping, err := s.hasOverlap(ctx, 0, req.StartTime, req.EndTime)
	if err != nil {
		return nil, err
	}
	if overlapping {
		return nil, ErrTimeSlotOverlap
	}

	slot := &models.TimeSlot{
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
	}

	if err := s.timeSlotRepo.Create(ctx, slot); err != nil {
		return nil, err
	}

	return slot, nil
}

// Update validates time bounds and checks for overlaps excluding the current slot.
func (s *timeSlotService) Update(ctx context.Context, id int64, req *models.CreateTimeSlotRequest) (*models.TimeSlot, error) {
	slot, err := s.timeSlotRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrTimeSlotNotFound
	}

	if err := s.validateTimeRange(req.StartTime, req.EndTime); err != nil {
		return nil, err
	}

	overlapping, err := s.hasOverlap(ctx, id, req.StartTime, req.EndTime)
	if err != nil {
		return nil, err
	}
	if overlapping {
		return nil, ErrTimeSlotOverlap
	}

	slot.StartTime = req.StartTime
	slot.EndTime = req.EndTime

	if err := s.timeSlotRepo.Update(ctx, slot); err != nil {
		return nil, err
	}

	return slot, nil
}

// Delete removes a time slot entity.
func (s *timeSlotService) Delete(ctx context.Context, id int64) error {
	_, err := s.timeSlotRepo.GetByID(ctx, id)
	if err != nil {
		return ErrTimeSlotNotFound
	}

	return s.timeSlotRepo.Delete(ctx, id)
}

// validateTimeRange ensures start time comes chronologically before end time.
func (s *timeSlotService) validateTimeRange(startTime, endTime string) error {
	start, err := time.Parse("15:04", startTime)
	if err != nil {
		return errors.New("invalid start time format")
	}

	end, err := time.Parse("15:04", endTime)
	if err != nil {
		return errors.New("invalid end time format")
	}

	if !start.Before(end) {
		return ErrInvalidTimeRange
	}

	return nil
}

// hasOverlap checks existing slots to prevent schedule collisions.
func (s *timeSlotService) hasOverlap(ctx context.Context, currentID int64, startTime, endTime string) (bool, error) {
	existingSlots, err := s.timeSlotRepo.GetAll(ctx)
	if err != nil {
		return false, err
	}

	newStart, _ := time.Parse("15:04", startTime)
	newEnd, _ := time.Parse("15:04", endTime)

	for _, slot := range existingSlots {
		// Ignore the current slot when performing updates
		if currentID > 0 && slot.ID == currentID {
			continue
		}

		exStart, _ := time.Parse("15:04", slot.StartTime)
		exEnd, _ := time.Parse("15:04", slot.EndTime)

		// Overlap condition: (StartA < EndB) and (EndA > StartB)
		if newStart.Before(exEnd) && newEnd.After(exStart) {
			return true, nil
		}
	}

	return false, nil
}