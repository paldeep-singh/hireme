-- Revert hire-me-db:singular_table_names from pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE "application" RENAME TO applications;
ALTER TABLE company RENAME TO companies;
ALTER TABLE requirement RENAME TO requirements;
ALTER TABLE "role" RENAME TO roles;

COMMIT;
