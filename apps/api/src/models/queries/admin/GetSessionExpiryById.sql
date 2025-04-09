/* @name GetSessionExpiryById */
SELECT
	expiry
FROM
	hire_me.session
WHERE
	id = :id !;

