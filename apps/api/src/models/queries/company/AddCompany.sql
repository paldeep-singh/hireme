/* @name AddCompany */
INSERT INTO hire_me.company (name, notes, website)
	VALUES (:name !, :notes !, :website !)
RETURNING
	id, name, notes, website;

