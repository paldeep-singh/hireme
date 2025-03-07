-- Revert hire-me-db:remove_application_table from pg

BEGIN;

SET search_path TO hire_me;

CREATE TABLE "application" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id integer NOT NULL,
  code_hash text NOT NULL,
  cover_letter text NOT NULL
);


ALTER TABLE "application" ADD FOREIGN KEY (role_id) REFERENCES "role" (id);

COMMIT;
