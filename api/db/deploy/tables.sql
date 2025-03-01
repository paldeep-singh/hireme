-- Deploy hire-me-db:tables to pg

BEGIN;

SET search_path = hire_me;

CREATE TYPE requirement_match_level AS ENUM (
  'exceeded',
  'met',
  'somewhat_met',
  'room_for_growth'
);

CREATE TABLE companies (
  id uuid PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE roles (
  id uuid PRIMARY KEY,
  company_id uuid NOT NULL,
  title text NOT NULL
);

CREATE TABLE requirements (
  id uuid PRIMARY KEY,
  role_id uuid NOT NULL,
  requirement text NOT NULL,
  match_level requirement_match_level NOT NULL,
  match_justification text NOT NULL,
  bonus boolean NOT NULL
);

CREATE TABLE applications (
  id uuid PRIMARY KEY,
  role_id uuid NOT NULL,
  code_hash text NOT NULL,
  cover_letter text NOT NULL
);

ALTER TABLE roles ADD FOREIGN KEY (company_id) REFERENCES companies (id);

ALTER TABLE requirements ADD FOREIGN KEY (role_id) REFERENCES roles (id);

ALTER TABLE applications ADD FOREIGN KEY (role_id) REFERENCES roles (id);

COMMIT;
