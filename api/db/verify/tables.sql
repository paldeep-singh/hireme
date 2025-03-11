-- Verify hire-me-db:tables on pg

BEGIN;

SET search_path = hire_me;

-- Verify ENUM types
DO $$ 
BEGIN
  ASSERT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_type'), 
    'contract_type ENUM does not exist';
  ASSERT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'requirement_match_level'), 
    'requirement_match_level ENUM does not exist';
END $$;

SELECT id, name
FROM company
WHERE FALSE;

SELECT id, company_id, title, "location", on_site, hybrid, "remote", job_type, 
salary_range, salary_includes_super, term, office_days, ad_url
FROM "role"
WHERE FALSE;

SELECT id, role_id, "description", bonus
FROM requirement
WHERE FALSE;

SELECT id, role_id, cover_letter, submitted
FROM "application"
WHERE FALSE;

SELECT id, application_id, requirement_id, match_level, match_justification
FROM competency
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
        (c.conrelid = 'application'::regclass AND a.attname = 'role_id' AND c.confrelid = 'role'::regclass) OR
        (c.conrelid = 'competency'::regclass AND a.attname = 'application_id' AND c.confrelid = 'application'::regclass) OR
        (c.conrelid = 'competency'::regclass AND a.attname = 'requirement_id' AND c.confrelid = 'requirement'::regclass)
    );

    IF fk_count < 5 THEN
        RAISE EXCEPTION 'One or more foreign key constraints are missing!';
    END IF;
END $$;


COMMIT;
