-- ===========================================================
-- CalHacks Database Setup Script
-- Creates database, table, indexes, and read-only user.
-- Compatible with standard PostgreSQL (no dblink required)
-- ===========================================================

-- -- 1️⃣ Create the database if it doesn't exist
-- DO
-- $$
-- BEGIN
--    IF NOT EXISTS (
--        SELECT FROM pg_database WHERE datname = 'calhacks'
--    ) THEN
--        EXECUTE 'CREATE DATABASE calhacks';
--    END IF;
-- END
-- $$ LANGUAGE plpgsql;

-- -- 2️⃣ Connect to the database
-- \connect calhacks

BEGIN;

-- Create the tables
CREATE TABLE IF NOT EXISTS politicians (
  id BIGSERIAL PRIMARY KEY,
  name                   VARCHAR(255) NOT NULL,
  position               VARCHAR(100) NOT NULL,
  state                  VARCHAR(100) NOT NULL,
  party_affiliation      VARCHAR(50)  NOT NULL,
  start_date_of_position DATE         NOT NULL,
  -- Helps dedupe on migration; adjust if you prefer a different natural key
  CONSTRAINT uq_politician_identity UNIQUE (name, position, state, party_affiliation, start_date_of_position)
);

CREATE TABLE IF NOT EXISTS holdings (
  id BIGSERIAL PRIMARY KEY,
  politician_id  BIGINT NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  company        VARCHAR(255) NOT NULL,
  ticker         VARCHAR(10),
  total_ownership NUMERIC(15,2)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_politicians_name   ON politicians (name);
CREATE INDEX IF NOT EXISTS idx_holdings_ticker    ON holdings (ticker);
CREATE INDEX IF NOT EXISTS idx_holdings_company   ON holdings (company);
CREATE INDEX IF NOT EXISTS idx_holdings_pol_id    ON holdings (politician_id);

-- Mock data
INSERT INTO politicians (name, position, state, party_affiliation, start_date_of_position)
VALUES
  ('Elaine Wu', 'Representative', 'Washington', 'Democratic', '2020-01-03'),
  ('Olivia Kim', 'Representative', 'Oregon', 'Democratic', '2023-01-03'),
  ('Robert Jenkins', 'Representative', 'Virginia', 'Republican', '2022-01-03'),
  ('Maria Torres', 'Delegate', 'Guam', 'Democratic', '2019-01-03'),
  ('Jonah Kaleopa', 'Delegate', 'American Samoa', 'Republican', '2021-01-03'),
  ('David Morales', 'Speaker of the House', 'Texas', 'Republican', '2023-01-07')
ON CONFLICT (name, position, state, party_affiliation, start_date_of_position)
DO NOTHING;

INSERT INTO holdings (politician_id, company, ticker, total_ownership)
SELECT p.id, h.company, h.ticker, h.total_ownership
FROM (
  VALUES
    -- Original holdings
    ('Elaine Wu', 'MediTech Holdings Ltd.', 'MDTH', 230000),
    ('Olivia Kim', 'Vertex Mobility Systems', 'VMSX', 4380000),
    ('Robert Jenkins', 'NorthStar Defense Systems', 'NSDS', 3780000),
    ('Maria Torres', 'Pacific Digital Ventures', 'PDVG', 950000),
    ('Jonah Kaleopa', 'Island Maritime Group', 'IMGN', 600000),
    ('David Morales', 'Sunterra Infrastructure LLC', 'SUNX', 6450000),

    -- Additional holdings for graph/web testing
    ('Elaine Wu', 'Vertex Mobility Systems', 'VMSX', 150000),     -- shared company with Olivia Kim
    ('Olivia Kim', 'MediTech Holdings Ltd.', 'MDTH', 90000),      -- shared company with Elaine Wu
    ('Robert Jenkins', 'Sunterra Infrastructure LLC', 'SUNX', 275000), -- shared with David Morales
    ('Maria Torres', 'Island Maritime Group', 'IMGN', 120000),    -- shared with Jonah Kaleopa
    ('David Morales', 'NorthStar Defense Systems', 'NSDS', 310000), -- shared with Robert Jenkins
    ('Jonah Kaleopa', 'Pacific Digital Ventures', 'PDVG', 85000)  -- shared with Maria Torres
) AS h(name, company, ticker, total_ownership)
JOIN politicians p ON p.name = h.name;

COMMIT;

-- Create a read-only user if not exists
DO
$$
BEGIN
   IF NOT EXISTS (
       SELECT FROM pg_catalog.pg_roles WHERE rolname = 'testuser'
   ) THEN
       CREATE USER testuser WITH PASSWORD 'testpassword';
   END IF;
END
$$ LANGUAGE plpgsql;

-- 6️⃣ Grant privileges
REVOKE ALL ON DATABASE railway FROM testuser;
GRANT CONNECT ON DATABASE railway TO testuser;

GRANT USAGE ON SCHEMA public TO testuser;
GRANT SELECT ON TABLE politicians TO testuser;
GRANT SELECT ON TABLE holdings TO testuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO testuser;

COMMIT;
