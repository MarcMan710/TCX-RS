-- Up Migration
CREATE TABLE IF NOT EXISTS time_slots (
    id BIGSERIAL PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_time_slot_range CHECK (end_time > start_time)
);

-- Down Migration
-- DROP TABLE IF EXISTS time_slots;