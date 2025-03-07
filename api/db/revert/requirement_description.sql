-- Revert hire-me-db:requirement_description from pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE requirement RENAME COLUMN  "description" TO requirement;

COMMIT;
