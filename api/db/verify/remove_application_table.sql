-- Verify hire-me-db:remove_application_table on pg

BEGIN;

SET search_path = hire_me;

SELECT id, company_id, title, cover_letter
FROM "role"
WHERE FALSE;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'application') THEN
        RAISE EXCEPTION 'Verification failed: application table still exists';
    END IF;
END $$;

ROLLBACK;
