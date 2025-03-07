-- Verify hire-me-db:requirement_description on pg

BEGIN;

set search_path TO hire_me;

SELECT id, role_id, "description", match_level, match_justification, bonus
FROM requirement
WHERE FALSE;

ROLLBACK;
