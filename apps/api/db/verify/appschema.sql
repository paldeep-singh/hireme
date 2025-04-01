-- Verify hire-me-db:appschema on pg
BEGIN;

SELECT
	pg_catalog.has_schema_privilege('hire_me', 'usage');

ROLLBACK;

