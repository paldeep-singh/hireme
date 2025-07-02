-- Revert hire-me-db:cascade-foreign-key-deletion from pg
BEGIN;

SET search_path = hire_me;

ALTER TABLE role
	DROP CONSTRAINT role_company_id_fkey,
	ADD CONSTRAINT role_company_id_fkey FOREIGN KEY (company_id) REFERENCES company (id);

ALTER TABLE salary
	DROP CONSTRAINT salary_role_id_fkey,
	ADD CONSTRAINT salary_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE role_location
	DROP CONSTRAINT role_location_role_id_fkey,
	ADD CONSTRAINT role_location_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE requirement
	DROP CONSTRAINT requirement_role_id_fkey,
	ADD CONSTRAINT requirement_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE application
	DROP CONSTRAINT application_role_id_fkey,
	ADD CONSTRAINT application_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE competency
	DROP CONSTRAINT competency_application_id_fkey,
	ADD CONSTRAINT competency_application_id_fkey FOREIGN KEY (application_id) REFERENCES application (id);

ALTER TABLE competency
	DROP CONSTRAINT competency_requirement_id_fkey,
	ADD CONSTRAINT competency_requirement_id_fkey FOREIGN KEY (requirement_id) REFERENCES requirement (id);

ALTER TABLE session
	DROP CONSTRAINT session_admin_id_fkey,
	ADD CONSTRAINT session_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES admin (id);

COMMIT;

