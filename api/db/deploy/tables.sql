-- Deploy hire-me-db:tables to pg

BEGIN;

SET search_path = hire_me;

CREATE TYPE requirement_match_level AS ENUM (
  'exceeded',
  'met',
  'room_for_growth'
);

CREATE TABLE companies (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL
);

CREATE TABLE roles (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company_id integer NOT NULL,
  title text NOT NULL
);

CREATE TABLE requirements (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id integer NOT NULL,
  requirement text NOT NULL,
  match_level requirement_match_level NOT NULL,
  match_justification text NOT NULL,
  bonus boolean NOT NULL
);

CREATE TABLE applications (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id integer NOT NULL,
  code_hash text NOT NULL,
  cover_letter text NOT NULL
);

ALTER TABLE roles ADD FOREIGN KEY (company_id) REFERENCES companies (id);

ALTER TABLE requirements ADD FOREIGN KEY (role_id) REFERENCES roles (id);

ALTER TABLE applications ADD FOREIGN KEY (role_id) REFERENCES roles (id);

COMMIT;
