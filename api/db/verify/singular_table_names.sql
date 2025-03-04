-- Verify hire-me-db:singular_table_names on pg

BEGIN;

SET search_path = hire_me;

SELECT id, name
FROM company
WHERE FALSE;

SELECT id, company_id, title
FROM "role"
WHERE FALSE;

SELECT id, role_id, requirement, match_level, match_justification, bonus
FROM "requirement"
WHERE FALSE;

SELECT id, role_id, code_hash, cover_letter
FROM "application"
WHERE FALSE;

DO $$ 
DECLARE fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fk_count
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
    WHERE c.contype = 'f'
    AND (
        (c.conrelid = 'role'::regclass AND a.attname = 'company_id' AND c.confrelid = 'company'::regclass) OR
        (c.conrelid = 'requirement'::regclass AND a.attname = 'role_id' AND c.confrelid = 'role'::regclass) OR
        (c.conrelid = 'application'::regclass AND a.attname = 'role_id' AND c.confrelid = 'role'::regclass)
    );

    IF fk_count < 3 THEN
        RAISE EXCEPTION 'One or more foreign key constraints are missing!';
    END IF;
END $$;

ROLLBACK;
