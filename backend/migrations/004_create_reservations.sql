-- Up Migration
CREATE TYPE reservation_status AS ENUM ('confirmed', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS reservations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    time_slot_id BIGINT NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    status reservation_status NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Prevents double booking the same court for the same date & time slot
-- Note: Cancelled reservations are excluded via a partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_reservation 
ON reservations (court_id, time_slot_id, reservation_date) 
WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_lookup ON reservations(court_id, reservation_date);

-- Down Migration
-- DROP INDEX IF EXISTS idx_unique_active_reservation;
-- DROP TABLE IF EXISTS reservations;
-- DROP TYPE IF EXISTS reservation_status;