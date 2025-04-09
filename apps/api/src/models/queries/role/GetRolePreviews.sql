/* @name GetRolePreviews */
SELECT
	r.id,
	r.company_id,
	r.title,
	r.ad_url,
	r.notes,
	r.date_added,
	c.name AS company,
	rl.location,
	a.date_submitted
FROM
	hire_me.role r
	JOIN hire_me.company c ON r.company_id = c.id
	LEFT JOIN hire_me.role_location rl ON rl.role_id = r.id
	LEFT JOIN hire_me.application a ON a.role_id = r.id;

