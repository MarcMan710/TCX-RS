package services

import (
	"context"
	"errors"
	"time"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/repositories"
)

var (
	ErrReservationNotFound          = errors.New("reservation not found")
	ErrSlotAlreadyBooked            = errors.New("the selected court and time slot is already booked for this date")
	ErrCourtNotAvailable            = errors.New("court is not currently available for reservation")
	ErrUnauthorizedAccess           = errors.New("you do not have permission to modify this reservation")
	ErrCannotCancelPastReservation = errors.New("cannot cancel a reservation on or after the reservation date")
)

// AvailabilitySlot represents a time slot along with its availability state.
type AvailabilitySlot struct {
	TimeSlot *models.TimeSlot `json:"time_slot"`
	IsBooked bool             `json:"is_booked"`
}

// ReservationService defines business logic for court bookings.
type ReservationService interface {
	CheckAvailability(ctx context.Context, courtID int64, dateStr string) ([]*AvailabilitySlot, error)
	CreateReservation(ctx context.Context, userID int64, req *models.CreateReservationRequest) (*models.Reservation, error)
	GetAllReservations(ctx context.Context) ([]*models.Reservation, error)
	GetUserReservations(ctx context.Context, userID int64) ([]*models.Reservation, error)
	GetReservationByID(ctx context.Context, id int64) (*models.Reservation, error)
	CancelReservation(ctx context.Context, reservationID, userID int64, isAdmin bool) error
}

type reservationService struct {
	reservationRepo repositories.ReservationRepository
	courtRepo       repositories.CourtRepository
	timeSlotRepo    repositories.TimeSlotRepository
}

// NewReservationService creates a new instance of ReservationService.
func NewReservationService(
	reservationRepo repositories.ReservationRepository,
	courtRepo repositories.CourtRepository,
	timeSlotRepo repositories.TimeSlotRepository,
) ReservationService {
	return &reservationService{
		reservationRepo: reservationRepo,
		courtRepo:       courtRepo,
		timeSlotRepo:    timeSlotRepo,
	}
}

// CheckAvailability fetches all time slots for a court on a date and marks whether each slot is booked.
func (s *reservationService) CheckAvailability(ctx context.Context, courtID int64, dateStr string) ([]*AvailabilitySlot, error) {
	_, err := s.courtRepo.GetByID(ctx, courtID)
	if err != nil {
		return nil, ErrCourtNotFound
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return nil, errors.New("invalid date format, expected YYYY-MM-DD")
	}

	allSlots, err := s.timeSlotRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	bookedReservations, err := s.reservationRepo.GetActiveByCourtAndDate(ctx, courtID, date)
	if err != nil {
		return nil, err
	}

	bookedSlotIDs := make(map[int64]bool)
	for _, res := range bookedReservations {
		bookedSlotIDs[res.TimeSlotID] = true
	}

	availability := make([]*AvailabilitySlot, 0, len(allSlots))
	for _, slot := range allSlots {
		availability = append(availability, &AvailabilitySlot{
			TimeSlot: slot,
			IsBooked: bookedSlotIDs[slot.ID],
		})
	}

	return availability, nil
}

// CreateReservation validates availability and registers a new court reservation.
func (s *reservationService) CreateReservation(ctx context.Context, userID int64, req *models.CreateReservationRequest) (*models.Reservation, error) {
	// 1. Validate court existence and status
	court, err := s.courtRepo.GetByID(ctx, req.CourtID)
	if err != nil {
		return nil, ErrCourtNotFound
	}
	if court.Status != models.CourtStatusAvailable {
		return nil, ErrCourtNotAvailable
	}

	// 2. Validate time slot existence
	_, err = s.timeSlotRepo.GetByID(ctx, req.TimeSlotID)
	if err != nil {
		return nil, ErrTimeSlotNotFound
	}

	// 3. Parse reservation date
	resDate, err := time.Parse("2006-01-02", req.ReservationDate)
	if err != nil {
		return nil, errors.New("invalid date format")
	}

	// 4. Check for double booking
	isBooked, err := s.reservationRepo.IsSlotBooked(ctx, req.CourtID, req.TimeSlotID, resDate)
	if err != nil {
		return nil, err
	}
	if isBooked {
		return nil, ErrSlotAlreadyBooked
	}

	reservation := &models.Reservation{
		UserID:          userID,
		CourtID:         req.CourtID,
		TimeSlotID:      req.TimeSlotID,
		ReservationDate: resDate,
		Status:          models.ReservationStatusConfirmed,
	}

	// 5. Persist reservation (Database UNIQUE constraint handles concurrent race conditions)
	if err := s.reservationRepo.Create(ctx, reservation); err != nil {
		if errors.Is(err, repositories.ErrDuplicateReservation) {
			return nil, ErrSlotAlreadyBooked
		}
		return nil, err
	}

	return reservation, nil
}

// GetAllReservations returns all reservations in the system (Admin route).
func (s *reservationService) GetAllReservations(ctx context.Context) ([]*models.Reservation, error) {
	return s.reservationRepo.GetAll(ctx)
}

// GetUserReservations retrieves all bookings belonging to a single customer.
func (s *reservationService) GetUserReservations(ctx context.Context, userID int64) ([]*models.Reservation, error) {
	return s.reservationRepo.GetByUserID(ctx, userID)
}

// GetReservationByID fetches a specific reservation by ID.
func (s *reservationService) GetReservationByID(ctx context.Context, id int64) (*models.Reservation, error) {
	reservation, err := s.reservationRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrReservationNotFound
	}
	return reservation, nil
}

// CancelReservation cancels an active booking if ownership or admin rights match.
func (s *reservationService) CancelReservation(ctx context.Context, reservationID, userID int64, isAdmin bool) error {
	reservation, err := s.reservationRepo.GetByID(ctx, reservationID)
	if err != nil {
		return ErrReservationNotFound
	}

	// Verify permission
	if !isAdmin && reservation.UserID != userID {
		return ErrUnauthorizedAccess
	}

	// Prevent cancellation of past or today's active reservations for standard users
	if !isAdmin {
		now := time.Now()
		today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
		if !reservation.ReservationDate.After(today) {
			return ErrCannotCancelPastReservation
		}
	}

	reservation.Status = models.ReservationStatusCancelled
	return s.reservationRepo.UpdateStatus(ctx, reservationID, models.ReservationStatusCancelled)
}