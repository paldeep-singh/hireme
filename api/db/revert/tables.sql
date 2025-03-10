-- Revert hire-me-db:tables from pg

BEGIN;

SET search_path = hire_me;

-- Drop foreign keys
ALTER TABLE competency DROP CONSTRAINT competency_requirement_id_fkey;
ALTER TABLE competency DROP CONSTRAINT competency_application_id_fkey;
ALTER TABLE "application" DROP CONSTRAINT application_role_id_fkey;
ALTER TABLE requirement DROP CONSTRAINT requirement_role_id_fkey;
ALTER TABLE "role" DROP CONSTRAINT role_company_id_fkey;

-- Drop tables
DROP TABLE competency;
DROP TABLE "application";
DROP TABLE requirement;
DROP TABLE "role";
DROP TABLE company;

-- Drop types
DROP TYPE REQUIREMENT_MATCH_LEVEL;
DROP TYPE CONTRACT_TYPE;

COMMIT;
