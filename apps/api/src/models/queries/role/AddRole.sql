/* @name AddRole */
INSERT INTO hire_me.role (company_id, title, notes, ad_url)
	VALUES (:company_id !, :title !, :notes !, :ad_url !)
RETURNING
	id, company_id, title, notes, ad_url, date_added;

