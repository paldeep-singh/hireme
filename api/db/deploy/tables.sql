-- Deploy hire-me-db:tables to pg
BEGIN;

SET search_path = hire_me;

CREATE TYPE CONTRACT_TYPE AS ENUM (
	'permanent',
	'fixed_term'
);

CREATE TYPE SALARY_PERIOD AS ENUM (
	'year',
	'month',
	'week',
	'day'
);

CREATE TYPE REQUIREMENT_MATCH_LEVEL AS ENUM (
	'exceeded',
	'met',
	'room_for_growth'
);

CREATE TABLE company (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name text NOT NULL,
	notes text,
	website text
);

CREATE TABLE role (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	company_id integer NOT NULL,
	title text NOT NULL,
	notes text,
	ad_url text
);

CREATE TABLE contract (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	role_id integer NOT NULL,
	type CONTRACT_TYPE NOT NULL,
	salary_range numrange,
	salary_includes_super boolean,
	salary_period SALARY_PERIOD,
	salary_currency text,
	term interval
);

CREATE TABLE role_location (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	role_id integer NOT NULL,
	location text NOT NULL,
	on_site boolean NOT NULL,
	hybrid boolean NOT NULL,
	remote boolean NOT NULL,
	office_days numrange
);

CREATE TABLE requirement (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	role_id integer NOT NULL,
	description text NOT NULL,
	bonus boolean NOT NULL
);

CREATE TABLE application (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	role_id integer NOT NULL,
	cover_letter text NOT NULL,
	submitted boolean NOT NULL
);

CREATE TABLE competency (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	application_id integer NOT NULL,
	requirement_id integer NOT NULL,
	match_level REQUIREMENT_MATCH_LEVEL NOT NULL,
	match_justification text NOT NULL
);

ALTER TABLE role
	ADD FOREIGN KEY (company_id) REFERENCES company (id);

ALTER TABLE contract
	ADD FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE role_location
	ADD FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE requirement
	ADD FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE application
	ADD FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE competency
	ADD FOREIGN KEY (application_id) REFERENCES application (id);

ALTER TABLE competency
	ADD FOREIGN KEY (requirement_id) REFERENCES requirement (id);

CREATE TABLE admin (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	email text NOT NULL,
	password_hash text NOT NULL,
	session_token text,
	session_expiry timestamptz
);

COMMIT;

