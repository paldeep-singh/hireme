-- Deploy hire-me-db:requirement_description to pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE requirement RENAME COLUMN "requirement" TO "description";

COMMIT;
