package repositories

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"KARO-BRS/backend/internal/models"
)

var (
	ErrCourtNotFound = errors.New("court not found in repository")
)

type CourtRepository interface {
	Create(ctx context.Context, court *models.Court) error
	GetByID(ctx context.Context, id int64) (*models.Court, error)
	GetAll(ctx context.Context) ([]*models.Court, error)
	Update(ctx context.Context, court *models.Court) error
	Delete(ctx context.Context, id int64) error
}

type courtRepository struct {
	db *sql.DB
}

func NewCourtRepository(db *sql.DB) CourtRepository {
	return &courtRepository{db: db}
}

func (r *courtRepository) Create(ctx context.Context, court *models.Court) error {
	query := `
		INSERT INTO courts (name, description, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	now := time.Now()
	err := r.db.QueryRowContext(
		ctx, query,
		court.Name, court.Description, court.Status, now, now,
	).Scan(&court.ID, &court.CreatedAt, &court.UpdatedAt)

	return err
}

func (r *courtRepository) GetByID(ctx context.Context, id int64) (*models.Court, error) {
	query := `
		SELECT id, name, description, status, created_at, updated_at
		FROM courts
		WHERE id = $1
	`
	court := &models.Court{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&court.ID, &court.Name, &court.Description, &court.Status, &court.CreatedAt, &court.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCourtNotFound
		}
		return nil, err
	}

	return court, nil
}

func (r *courtRepository) GetAll(ctx context.Context) ([]*models.Court, error) {
	query := `
		SELECT id, name, description, status, created_at, updated_at
		FROM courts
		ORDER BY id ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courts []*models.Court
	for rows.Next() {
		c := &models.Court{}
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.Status, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		courts = append(courts, c)
	}

	return courts, nil
}

func (r *courtRepository) Update(ctx context.Context, court *models.Court) error {
	query := `
		UPDATE courts
		SET name = $1, description = $2, status = $3, updated_at = $4
		WHERE id = $5
	`
	court.UpdatedAt = time.Now()
	res, err := r.db.ExecContext(ctx, query, court.Name, court.Description, court.Status, court.UpdatedAt, court.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrCourtNotFound
	}

	return nil
}

func (r *courtRepository) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM courts WHERE id = $1`
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrCourtNotFound
	}

	return nil
}