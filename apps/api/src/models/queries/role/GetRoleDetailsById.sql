/* @name GetRoleDetailsByRoleId */
SELECT
	r.id as role_id,
	r.title,
	r.ad_url,
	r.notes,
	r.date_added,
	r.company_id,
	c.name as company_name,
	c.notes as company_notes,
	c.website as company_website,
	l.id as location_id,
	l.location,
	l.on_site,
	l.hybrid,
	l.remote,
	ct.id as contract_id,
	ct.type as contract_type,
	ct.salary_range,
	ct.salary_includes_super,
	ct.salary_period,
	ct.salary_currency,
	ct.term,
	a.id as application_id,
	a.cover_letter,
	a.date_submitted
FROM
	hire_me.role r
	JOIN hire_me.company c ON c.id = r.company_id
	LEFT JOIN hire_me.role_location l ON l.role_id = r.id
	LEFT JOIN hire_me.contract ct ON ct.role_id = r.id
	LEFT JOIN hire_me.application a ON a.role_id = r.id
WHERE
	r.id = :role_id !;

