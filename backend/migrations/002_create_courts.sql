-- Up Migration
CREATE TYPE court_status AS ENUM ('available', 'maintenance', 'unavailable');

CREATE TABLE IF NOT EXISTS courts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status court_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
-- DROP TABLE IF EXISTS courts;
-- DROP TYPE IF EXISTS court_status;