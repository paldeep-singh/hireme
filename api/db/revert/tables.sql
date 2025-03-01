-- Revert hire-me-db:tables from pg

BEGIN;

SET search_path = hire_me;

DROP TABLE companies, roles, requirements, applications CASCADE;

DROP TYPE requirement_match_level;

COMMIT;
