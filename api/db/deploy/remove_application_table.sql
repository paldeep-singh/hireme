-- Deploy hire-me-db:remove_application_table to pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE "role" ADD COLUMN 
    cover_letter text NOT NULL
;

-- Since the db has not yet been deployed in production, we can simply drop the table
-- without copying values for cover_letter to the new column in the roles table
DROP TABLE "application" CASCADE;

COMMIT;
