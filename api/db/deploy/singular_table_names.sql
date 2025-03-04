-- Deploy hire-me-db:singular_table_names to pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE applications RENAME TO "application";
ALTER TABLE companies RENAME TO company;
ALTER TABLE requirements RENAME TO requirement;
ALTER TABLE roles RENAME TO "role";

COMMIT;
