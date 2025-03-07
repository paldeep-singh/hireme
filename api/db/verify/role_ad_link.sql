-- Verify hire-me-db:role_ad_link on pg

BEGIN;


SET search_path TO hire_me;

SELECT id, company_id, title, cover_letter, ad_url
FROM "role"
WHERE FALSE;

ROLLBACK;
