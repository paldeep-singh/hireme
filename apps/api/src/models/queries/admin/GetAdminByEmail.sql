/* @name GetAdminByEmail */
SELECT
	id,
	email,
	password_hash
FROM
	hire_me.admin
WHERE
	email = :email;

