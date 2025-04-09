/* @name AddRequirement */
INSERT INTO hire_me.requirement (role_id, bonus, description)
	VALUES (:role_id !, :bonus !, :description !)
RETURNING
	id, role_id, bonus, description;

