/* @name GetRequirementsByRoleId */
SELECT
	id,
	description,
	bonus
FROM
	hire_me.requirement r
WHERE
	r.role_id = :role_id !;

