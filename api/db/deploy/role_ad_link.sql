-- Deploy hire-me-db:role_ad_link to pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE "role" ADD COLUMN ad_url text;

COMMIT;
