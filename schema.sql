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
  id                   BIGSERIAL PRIMARY KEY,
  name                 VARCHAR(255) NOT NULL,
  position             VARCHAR(100) NOT NULL,
  state                VARCHAR(100) NOT NULL,
  party_affiliation    VARCHAR(50)  NOT NULL,
  estimated_net_worth  NUMERIC(18,2) NOT NULL DEFAULT 0,
  last_trade_date      DATE,

  CONSTRAINT uq_politician_identity UNIQUE (name, position, state, party_affiliation)
);

CREATE TABLE IF NOT EXISTS companies (
  id      BIGSERIAL PRIMARY KEY,
  name    VARCHAR(255) NOT NULL,
  ticker  VARCHAR(10)  NOT NULL,
  CONSTRAINT uq_companies_ticker UNIQUE (ticker),
  CONSTRAINT uq_companies_name   UNIQUE (name)
);
CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies (ticker);

CREATE TABLE IF NOT EXISTS holdings (
  id             BIGSERIAL PRIMARY KEY,
  politician_id  BIGINT NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  company_id     BIGINT NOT NULL REFERENCES companies(id)    ON DELETE CASCADE,
  holding_value  NUMERIC(18,2) NOT NULL DEFAULT 0,

  CONSTRAINT uq_holdings_unique UNIQUE (politician_id, company_id)
);
CREATE INDEX IF NOT EXISTS idx_holdings_pol ON holdings (politician_id);
CREATE INDEX IF NOT EXISTS idx_holdings_co  ON holdings (company_id);

-- Mock data
INSERT INTO politicians (name, position, state, party_affiliation, estimated_net_worth, last_trade_date)
VALUES
  ('Elaine Wu',       'Representative',       'Washington',      'Democratic',  3200000, '2024-12-20'),
  ('Olivia Kim',      'Representative',       'Oregon',          'Democratic',  5100000, '2025-01-15'),
  ('Robert Jenkins',  'Representative',       'Virginia',        'Republican',  4500000, '2025-02-10'),
  ('Maria Torres',    'Delegate',             'Guam',            'Democratic',  1800000, '2024-11-05'),
  ('Jonah Kaleopa',   'Delegate',             'American Samoa',  'Republican',  1200000, '2025-03-01'),
  ('David Morales',   'Speaker of the House', 'Texas',           'Republican',  8700000, '2025-04-22');

INSERT INTO companies (name, ticker)
VALUES
  ('MediTech Holdings Ltd.',      'MDTH'),
  ('Vertex Mobility Systems',     'VMSX'),
  ('NorthStar Defense Systems',   'NSDS'),
  ('Pacific Digital Ventures',    'PDVG'),
  ('Island Maritime Group',       'IMGN'),
  ('Sunterra Infrastructure LLC', 'SUNX');

WITH v(p_name, p_position, p_state, p_party, c_ticker, holding_value) AS (
  VALUES
    -- Main edges
    ('Elaine Wu',      'Representative',       'Washington',      'Democratic', 'MDTH',  230000),
    ('Olivia Kim',     'Representative',       'Oregon',          'Democratic', 'VMSX',  4380000),
    ('Robert Jenkins', 'Representative',       'Virginia',        'Republican', 'NSDS',  3780000),
    ('Maria Torres',   'Delegate',             'Guam',            'Democratic', 'PDVG',   950000),
    ('Jonah Kaleopa',  'Delegate',             'American Samoa',  'Republican', 'IMGN',   600000),
    ('David Morales',  'Speaker of the House', 'Texas',           'Republican', 'SUNX',  6450000),

    -- Cross-links for graph testing
    ('Elaine Wu',      'Representative',       'Washington',      'Democratic', 'VMSX',   150000),
    ('Olivia Kim',     'Representative',       'Oregon',          'Democratic', 'MDTH',    90000),
    ('Robert Jenkins', 'Representative',       'Virginia',        'Republican', 'SUNX',   275000),
    ('Maria Torres',   'Delegate',             'Guam',            'Democratic', 'IMGN',   120000),
    ('David Morales',  'Speaker of the House', 'Texas',           'Republican', 'NSDS',   310000),
    ('Jonah Kaleopa',  'Delegate',             'American Samoa',  'Republican', 'PDVG',    85000)
)
INSERT INTO holdings (politician_id, company_id, holding_value)
SELECT p.id, c.id, v.holding_value
FROM v
JOIN politicians p
  ON  p.name = v.p_name
  AND p.position = v.p_position
  AND p.state = v.p_state
  AND p.party_affiliation = v.p_party
JOIN companies c
  ON c.ticker = v.c_ticker;

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
GRANT SELECT ON TABLE companies TO testuser;
GRANT SELECT ON TABLE holdings TO testuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO testuser;

COMMIT;
