package services

import (
	"context"
	"errors"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/repositories"
)

var (
	ErrCourtNotFound = errors.New("court not found")
)

// CourtService defines the interface for court management logic.
type CourtService interface {
	GetAllCourts(ctx context.Context) ([]*models.Court, error)
	GetCourtByID(ctx context.Context, id int64) (*models.Court, error)
	CreateCourt(ctx context.Context, req *models.CreateCourtRequest) (*models.Court, error)
	UpdateCourt(ctx context.Context, id int64, req *models.UpdateCourtRequest) (*models.Court, error)
	DeleteCourt(ctx context.Context, id int64) error
	IsCourtActive(ctx context.Context, id int64) (bool, error)
}

type courtService struct {
	courtRepo repositories.CourtRepository
}

// NewCourtService creates a new instance of CourtService.
func NewCourtService(courtRepo repositories.CourtRepository) CourtService {
	return &courtService{
		courtRepo: courtRepo,
	}
}

// GetAllCourts retrieves all registered badminton courts.
func (s *courtService) GetAllCourts(ctx context.Context) ([]*models.Court, error) {
	return s.courtRepo.GetAll(ctx)
}

// GetCourtByID retrieves details for a single court.
func (s *courtService) GetCourtByID(ctx context.Context, id int64) (*models.Court, error) {
	court, err := s.courtRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrCourtNotFound
	}
	return court, nil
}

// CreateCourt handles validation and persistence of a new court entity.
func (s *courtService) CreateCourt(ctx context.Context, req *models.CreateCourtRequest) (*models.Court, error) {
	court := &models.Court{
		Name:        req.Name,
		Description: req.Description,
		Status:      req.Status,
	}

	if err := s.courtRepo.Create(ctx, court); err != nil {
		return nil, err
	}

	return court, nil
}

// UpdateCourt updates existing court data.
func (s *courtService) UpdateCourt(ctx context.Context, id int64, req *models.UpdateCourtRequest) (*models.Court, error) {
	court, err := s.courtRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrCourtNotFound
	}

	court.Name = req.Name
	court.Description = req.Description
	court.Status = req.Status

	if err := s.courtRepo.Update(ctx, court); err != nil {
		return nil, err
	}

	return court, nil
}

// DeleteCourt removes a court entity by ID.
func (s *courtService) DeleteCourt(ctx context.Context, id int64) error {
	_, err := s.courtRepo.GetByID(ctx, id)
	if err != nil {
		return ErrCourtNotFound
	}

	return s.courtRepo.Delete(ctx, id)
}

// IsCourtActive verifies whether a given court is available for reservations.
func (s *courtService) IsCourtActive(ctx context.Context, id int64) (bool, error) {
	court, err := s.courtRepo.GetByID(ctx, id)
	if err != nil {
		return false, ErrCourtNotFound
	}

	return court.Status == models.CourtStatusAvailable, nil
}