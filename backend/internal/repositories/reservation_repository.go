package repositories

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
	"KARO-BRS/backend/internal/models"
)

var (
	ErrReservationNotFound  = errors.New("reservation not found in repository")
	ErrDuplicateReservation = errors.New("reservation slot is already taken")
)

type ReservationRepository interface {
	Create(ctx context.Context, reservation *models.Reservation) error
	GetByID(ctx context.Context, id int64) (*models.Reservation, error)
	GetAll(ctx context.Context) ([]*models.Reservation, error)
	GetByUserID(ctx context.Context, userID int64) ([]*models.Reservation, error)
	GetActiveByCourtAndDate(ctx context.Context, courtID int64, date time.Time) ([]*models.Reservation, error)
	IsSlotBooked(ctx context.Context, courtID, timeSlotID int64, date time.Time) (bool, error)
	UpdateStatus(ctx context.Context, id int64, status models.ReservationStatus) error
}

type reservationRepository struct {
	db *sql.DB
}

func NewReservationRepository(db *sql.DB) ReservationRepository {
	return &reservationRepository{db: db}
}

func (r *reservationRepository) Create(ctx context.Context, reservation *models.Reservation) error {
	query := `
		INSERT INTO reservations (user_id, court_id, time_slot_id, reservation_date, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`
	now := time.Now()
	err := r.db.QueryRowContext(
		ctx, query,
		reservation.UserID, reservation.CourtID, reservation.TimeSlotID,
		reservation.ReservationDate, reservation.Status, now, now,
	).Scan(&reservation.ID, &reservation.CreatedAt, &reservation.UpdatedAt)

	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" { // 23505 is PostgreSQL unique_violation
			return ErrDuplicateReservation
		}
		return err
	}

	return nil
}

func (r *reservationRepository) GetByID(ctx context.Context, id int64) (*models.Reservation, error) {
	query := `
		SELECT r.id, r.user_id, r.court_id, r.time_slot_id, r.reservation_date, r.status, r.created_at, r.updated_at,
		       u.name, u.email, c.name, ts.start_time, ts.end_time
		FROM reservations r
		JOIN users u ON r.user_id = u.id
		JOIN courts c ON r.court_id = c.id
		JOIN time_slots ts ON r.time_slot_id = ts.id
		WHERE r.id = $1
	`
	res := &models.Reservation{User: &models.User{}, Court: &models.Court{}, TimeSlot: &models.TimeSlot{}}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&res.ID, &res.UserID, &res.CourtID, &res.TimeSlotID, &res.ReservationDate, &res.Status, &res.CreatedAt, &res.UpdatedAt,
		&res.User.Name, &res.User.Email, &res.Court.Name, &res.TimeSlot.StartTime, &res.TimeSlot.EndTime,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrReservationNotFound
		}
		return nil, err
	}

	return res, nil
}

func (r *reservationRepository) GetAll(ctx context.Context) ([]*models.Reservation, error) {
	query := `
		SELECT r.id, r.user_id, r.court_id, r.time_slot_id, r.reservation_date, r.status, r.created_at, r.updated_at,
		       u.name, u.email, c.name, ts.start_time, ts.end_time
		FROM reservations r
		JOIN users u ON r.user_id = u.id
		JOIN courts c ON r.court_id = c.id
		JOIN time_slots ts ON r.time_slot_id = ts.id
		ORDER BY r.reservation_date DESC, ts.start_time ASC
	`
	return r.queryReservations(ctx, query)
}

func (r *reservationRepository) GetByUserID(ctx context.Context, userID int64) ([]*models.Reservation, error) {
	query := `
		SELECT r.id, r.user_id, r.court_id, r.time_slot_id, r.reservation_date, r.status, r.created_at, r.updated_at,
		       u.name, u.email, c.name, ts.start_time, ts.end_time
		FROM reservations r
		JOIN users u ON r.user_id = u.id
		JOIN courts c ON r.court_id = c.id
		JOIN time_slots ts ON r.time_slot_id = ts.id
		WHERE r.user_id = $1
		ORDER BY r.reservation_date DESC, ts.start_time ASC
	`
	return r.queryReservations(ctx, query, userID)
}

func (r *reservationRepository) GetActiveByCourtAndDate(ctx context.Context, courtID int64, date time.Time) ([]*models.Reservation, error) {
	query := `
		SELECT r.id, r.user_id, r.court_id, r.time_slot_id, r.reservation_date, r.status, r.created_at, r.updated_at,
		       u.name, u.email, c.name, ts.start_time, ts.end_time
		FROM reservations r
		JOIN users u ON r.user_id = u.id
		JOIN courts c ON r.court_id = c.id
		JOIN time_slots ts ON r.time_slot_id = ts.id
		WHERE r.court_id = $1 AND r.reservation_date = $2 AND r.status != 'cancelled'
	`
	return r.queryReservations(ctx, query, courtID, date)
}

func (r *reservationRepository) IsSlotBooked(ctx context.Context, courtID, timeSlotID int64, date time.Time) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1 FROM reservations
			WHERE court_id = $1 AND time_slot_id = $2 AND reservation_date = $3 AND status != 'cancelled'
		)
	`
	var exists bool
	err := r.db.QueryRowContext(ctx, query, courtID, timeSlotID, date).Scan(&exists)
	return exists, err
}

func (r *reservationRepository) UpdateStatus(ctx context.Context, id int64, status models.ReservationStatus) error {
	query := `
		UPDATE reservations
		SET status = $1, updated_at = $2
		WHERE id = $3
	`
	res, err := r.db.ExecContext(ctx, query, status, time.Now(), id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrReservationNotFound
	}

	return nil
}

func (r *reservationRepository) queryReservations(ctx context.Context, query string, args ...interface{}) ([]*models.Reservation, error) {
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservations []*models.Reservation
	for rows.Next() {
		res := &models.Reservation{User: &models.User{}, Court: &models.Court{}, TimeSlot: &models.TimeSlot{}}
		err := rows.Scan(
			&res.ID, &res.UserID, &res.CourtID, &res.TimeSlotID, &res.ReservationDate, &res.Status, &res.CreatedAt, &res.UpdatedAt,
			&res.User.Name, &res.User.Email, &res.Court.Name, &res.TimeSlot.StartTime, &res.TimeSlot.EndTime,
		)
		if err != nil {
			return nil, err
		}
		reservations = append(reservations, res)
	}

	return reservations, nil
}