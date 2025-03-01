-- Verify hire-me-db:tables on pg

BEGIN;

SET search_path = hire_me;

SELECT id, name
FROM companies
WHERE FALSE;

SELECT id, company_id, title
FROM roles
WHERE FALSE;

SELECT id, role_id, requirement, match_level, match_justification, bonus
FROM requirements
WHERE FALSE;

DO $$ 
DECLARE fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fk_count
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
    WHERE c.contype = 'f'
    AND (
        (c.conrelid = 'roles'::regclass AND a.attname = 'company_id' AND c.confrelid = 'companies'::regclass) OR
        (c.conrelid = 'requirements'::regclass AND a.attname = 'role_id' AND c.confrelid = 'roles'::regclass) OR
        (c.conrelid = 'applications'::regclass AND a.attname = 'role_id' AND c.confrelid = 'roles'::regclass)
    );

    IF fk_count < 3 THEN
        RAISE EXCEPTION 'One or more foreign key constraints are missing!';
    END IF;
END $$;




ROLLBACK;
