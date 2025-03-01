-- Revert hire-me-db:appschema from pg

BEGIN;

DROP SCHEMA hire_me CASCADE;

COMMIT;
