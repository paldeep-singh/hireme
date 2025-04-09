/* @name AddSession */
INSERT INTO hire_me.session (id, expiry, admin_id)
	VALUES (:id !, :expiry !, :admin_id !)
RETURNING
	id, expiry;

