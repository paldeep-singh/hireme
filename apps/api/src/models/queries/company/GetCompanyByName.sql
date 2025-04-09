/* @name GetCompanyByName */
SELECT
	id,
	name
FROM
	hire_me.company
WHERE
	name = :name;

