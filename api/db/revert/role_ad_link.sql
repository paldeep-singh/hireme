-- Revert hire-me-db:role_ad_link from pg

BEGIN;

SET search_path TO hire_me;

ALTER TABLE "role" DROP COLUMN ad_url;

COMMIT;
