-- Verify hire-me-db:cascade-foreign-key-deletion on pg
BEGIN;

SET search_path = hire_me;

DO $$
BEGIN
	IF EXISTS (
		SELECT
			1
		FROM
			pg_constraint
		WHERE
			conname IN ('role_company_id_fkey', 'salary_role_id_fkey', 'role_location_role_id_fkey', 'requirement_role_id_fkey', 'application_role_id_fkey', 'competency_application_id_fkey', 'competency_requirement_id_fkey', 'session_admin_id_fkey')
			AND confdeltype != 'c') THEN
	RAISE EXCEPTION 'One or more constraints are not ON DELETE CASCADE';
END IF;
END
$$;

ROLLBACK;

