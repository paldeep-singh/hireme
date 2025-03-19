-- Verify hire-me-db:tables on pg
BEGIN;

SET search_path = hire_me;

-- Verify ENUM types
DO $$
BEGIN
	ASSERT EXISTS (
		SELECT
			1
		FROM
			pg_type
		WHERE
			typname = 'contract_type'), 'contract_type ENUM does not exist';
	ASSERT EXISTS (
		SELECT
			1
		FROM
			pg_type
		WHERE
			typname = 'salary_period'), 'salary_period ENUM does not exist';
	ASSERT EXISTS (
		SELECT
			1
		FROM
			pg_type
		WHERE
			typname = 'requirement_match_level'), 'requirement_match_level ENUM does not exist';
END
$$;

SELECT
	id,
	name,
	notes,
	website
FROM
	company
WHERE
	FALSE;

SELECT
	id,
	company_id,
	title,
	notes,
	ad_url
FROM
	"role"
WHERE
	FALSE;

SELECT
	id,
	role_id,
	type,
	salary_range,
	salary_includes_super,
	salary_period,
	salary_currency,
	term
FROM
	contract
WHERE
	FALSE;

SELECT
	id,
	role_id,
	location,
	on_site,
	hybrid,
	remote,
	office_days
FROM
	role_location
WHERE
	FALSE;

SELECT
	id,
	role_id,
	"description",
	bonus
FROM
	requirement
WHERE
	FALSE;

SELECT
	id,
	role_id,
	cover_letter,
	submitted
FROM
	"application"
WHERE
	FALSE;

SELECT
	id,
	application_id,
	requirement_id,
	match_level,
	match_justification
FROM
	competency
WHERE
	FALSE;

DO $$
DECLARE
	fk_count integer;
BEGIN
	SELECT
		COUNT(*) INTO fk_count
	FROM
		pg_constraint c
		JOIN pg_attribute a ON a.attnum = ANY (c.conkey)
			AND a.attrelid = c.conrelid
	WHERE
		c.contype = 'f'
		AND ((c.conrelid = 'role'::regclass
				AND a.attname = 'company_id'
				AND c.confrelid = 'company'::regclass)
			OR (c.conrelid = 'requirement'::regclass
				AND a.attname = 'role_id'
				AND c.confrelid = 'role'::regclass)
			OR (c.conrelid = 'application'::regclass
				AND a.attname = 'role_id'
				AND c.confrelid = 'role'::regclass)
			OR (c.conrelid = 'competency'::regclass
				AND a.attname = 'application_id'
				AND c.confrelid = 'application'::regclass)
			OR (c.conrelid = 'competency'::regclass
				AND a.attname = 'requirement_id'
				AND c.confrelid = 'requirement'::regclass)
			OR (c.conrelid = 'contract'::regclass
				AND a.attname = 'role_id'
				AND c.confrelid = 'role'::regclass)
			OR (c.conrelid = 'role_location'::regclass
				AND a.attname = 'role_id'
				AND c.confrelid = 'role'::regclass)
			OR (c.conrelid = 'session'::regclass
				AND a.attname = 'admin_id'
				AND c.confrelid = 'admin'::regclass));
	IF fk_count < 8 THEN
		RAISE EXCEPTION 'One or more foreign key constraints are missing!';
	END IF;
END
$$;

SELECT
	id,
	email,
	password_hash
FROM
	admin
WHERE
	FALSE;

SELECT
	id,
	expiry,
	admin_id
FROM
	session
WHERE
	FALSE;

COMMIT;

