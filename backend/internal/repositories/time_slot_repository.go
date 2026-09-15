package repositories

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"KARO-BRS/backend/internal/models"
)

var (
	ErrTimeSlotNotFound = errors.New("time slot not found in repository")
)

type TimeSlotRepository interface {
	Create(ctx context.Context, slot *models.TimeSlot) error
	GetByID(ctx context.Context, id int64) (*models.TimeSlot, error)
	GetAll(ctx context.Context) ([]*models.TimeSlot, error)
	Update(ctx context.Context, slot *models.TimeSlot) error
	Delete(ctx context.Context, id int64) error
}

type timeSlotRepository struct {
	db *sql.DB
}

func NewTimeSlotRepository(db *sql.DB) TimeSlotRepository {
	return &timeSlotRepository{db: db}
}

func (r *timeSlotRepository) Create(ctx context.Context, slot *models.TimeSlot) error {
	query := `
		INSERT INTO time_slots (start_time, end_time, created_at)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`
	now := time.Now()
	return r.db.QueryRowContext(ctx, query, slot.StartTime, slot.EndTime, now).Scan(&slot.ID, &slot.CreatedAt)
}

func (r *timeSlotRepository) GetByID(ctx context.Context, id int64) (*models.TimeSlot, error) {
	query := `
		SELECT id, start_time, end_time, created_at
		FROM time_slots
		WHERE id = $1
	`
	slot := &models.TimeSlot{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(&slot.ID, &slot.StartTime, &slot.EndTime, &slot.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTimeSlotNotFound
		}
		return nil, err
	}
	return slot, nil
}

func (r *timeSlotRepository) GetAll(ctx context.Context) ([]*models.TimeSlot, error) {
	query := `
		SELECT id, start_time, end_time, created_at
		FROM time_slots
		ORDER BY start_time ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var slots []*models.TimeSlot
	for rows.Next() {
		s := &models.TimeSlot{}
		if err := rows.Scan(&s.ID, &s.StartTime, &s.EndTime, &s.CreatedAt); err != nil {
			return nil, err
		}
		slots = append(slots, s)
	}

	return slots, nil
}

func (r *timeSlotRepository) Update(ctx context.Context, slot *models.TimeSlot) error {
	query := `
		UPDATE time_slots
		SET start_time = $1, end_time = $2
		WHERE id = $3
	`
	res, err := r.db.ExecContext(ctx, query, slot.StartTime, slot.EndTime, slot.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrTimeSlotNotFound
	}

	return nil
}

func (r *timeSlotRepository) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM time_slots WHERE id = $1`
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrTimeSlotNotFound
	}

	return nil
}