-- Deploy hire-me-db:tables to pg

BEGIN;

SET search_path = hire_me;

CREATE TYPE CONTRACT_TYPE AS ENUM (
  'full-time',
  'part-time',
  'casual',
  'fixed-term'
);

CREATE TYPE REQUIREMENT_MATCH_LEVEL AS ENUM (
  'exceeded',
  'met',
  'room_for_growth'
);

CREATE TABLE company (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

CREATE TABLE "role" (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  "location" TEXT NOT NULL,
  on_site BOOLEAN NOT NULL,
  hybrid BOOLEAN NOT NULL,
  "remote" BOOLEAN NOT NULL,
  "contract_type" CONTRACT_TYPE NOT NULL,
  salary_range numrange,
  salary_includes_super BOOLEAN,
  term interval, 
  office_days numrange,
  ad_url TEXT
);

CREATE TABLE requirement (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  bonus BOOLEAN NOT NULL
);

CREATE TABLE "application" (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id INTEGER NOT NULL,
  cover_letter TEXT NOT NULL,
  submitted BOOLEAN NOT NULL
);

CREATE TABLE competency (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  application_id INTEGER NOT NULL,
  requirement_id INTEGER NOT NULL,
  match_level REQUIREMENT_MATCH_LEVEL NOT NULL,
  match_justification TEXT NOT NULL
);

ALTER TABLE "role" ADD FOREIGN KEY (company_id) REFERENCES company (id);

ALTER TABLE requirement ADD FOREIGN KEY (role_id) REFERENCES "role" (id);

ALTER TABLE "application" ADD FOREIGN KEY (role_id) REFERENCES "role" (id);

ALTER TABLE competency ADD FOREIGN KEY (application_id) REFERENCES "application" (id);

ALTER TABLE competency ADD FOREIGN KEY (requirement_id) REFERENCES requirement (id);

COMMIT;
