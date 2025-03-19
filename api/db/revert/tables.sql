-- Revert hire-me-db:tables from pg
BEGIN;

SET search_path = hire_me;

ALTER TABLE session
	DROP CONSTRAINT session_admin_id_fkey;

DROP TABLE session;

DROP TABLE admin;

-- Drop foreign keys
ALTER TABLE competency
	DROP CONSTRAINT competency_requirement_id_fkey;

ALTER TABLE competency
	DROP CONSTRAINT competency_application_id_fkey;

ALTER TABLE application
	DROP CONSTRAINT application_role_id_fkey;

ALTER TABLE requirement
	DROP CONSTRAINT requirement_role_id_fkey;

ALTER TABLE role_location
	DROP CONSTRAINT role_location_role_id_fkey;

ALTER TABLE contract
	DROP CONSTRAINT contract_role_id_fkey;

ALTER TABLE role
	DROP CONSTRAINT role_company_id_fkey;

-- Drop tables
DROP TABLE competency;

DROP TABLE application;

DROP TABLE requirement;

DROP TABLE role_location;

DROP TABLE contract;

DROP TABLE role;

DROP TABLE company;

-- Drop types
DROP TYPE REQUIREMENT_MATCH_LEVEL;

DROP TYPE SALARY_PERIOD;

DROP TYPE CONTRACT_TYPE;

COMMIT;

