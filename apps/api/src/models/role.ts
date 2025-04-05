import Role, {
	RoleId,
	RoleInitializer,
} from "@repo/shared/generated/db/hire_me/Role";
import { RoleDetails, RolePreview } from "@repo/shared/types/Role";
import { errors } from "pg-promise";
import db from "./db";

async function addRole({ title, company_id, ad_url, notes }: RoleInitializer) {
	try {
		const role = await db.one<Role>(
			`INSERT INTO role (company_id, title, notes, ad_url) VALUES ($1, $2, $3, $4) 
      RETURNING id, company_id, title, notes, ad_url, date_added`,
			[company_id, title, notes, ad_url ?? null],
		);

		return role;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getRolePreviews(): Promise<RolePreview[]> {
	try {
		const rolePreviews = await db.manyOrNone<RolePreview>(
			`SELECT r.id, r.company_id, r.title, r.ad_url, r.notes, r.date_added, c.name AS company, rl.location, a.date_submitted
         FROM role r
         JOIN company c ON r.company_id = c.id
  		 LEFT JOIN role_location rl ON rl.role_id = r.id
  		 LEFT JOIN application a ON a.role_id = r.id;`,
		);

		return rolePreviews;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export async function getRoleDetails(id: RoleId): Promise<RoleDetails> {
	try {
		const roleDetails = await db.one<RoleDetails>(
			`
			SELECT r.id, r.company_id, r.title, r.ad_url, r.notes, r.date_added,
				jsonb_build_object(
					'id', c.id,
					'name', c.name,
					'notes', c.notes,
					'website', c.website
				) AS company,

				CASE
					WHEN l.id IS NULL THEN NULL
					ELSE jsonb_build_object(
							'id', l.id,
							'location', l.location,
							'on_site', l.on_site,
							'hybrid', l.hybrid,
							'remote', l.remote,
							'office_days', l.office_days
						)
				END AS location,

				CASE 
					WHEN ct.id IS NULL THEN NULL
					ELSE jsonb_build_object(
						'id', ct.id,
						'type', ct.type,
						'salary_range', ct.salary_range,
						'salary_includes_super', ct.salary_includes_super,
						'salary_period', ct.salary_period,
						'salary_currency', ct.salary_currency,
						'term', ct.term
						)
				END AS contract,
					
				CASE
					WHEN a.id IS NULL THEN NULL
					ELSE json_build_object(
						'id', a.id,
						'cover_letter', a.cover_letter,
						'date_submitted', a.date_submitted
					)
				END AS application,

				COALESCE(
					jsonb_agg(
						jsonb_build_object(
						'id', req.id,
						'description', req.description,
						'bonus', req.bonus
						)
					) FILTER (WHERE req.id IS NOT NULL),
					'[]'::jsonb
				) AS requirements
			FROM role r
			JOIN company c ON c.id = r.company_id
			LEFT JOIN role_location l ON l.role_id = r.id
			LEFT JOIN contract ct ON ct.role_id = r.id
			LEFT JOIN requirement req ON req.role_id = r.id
			LEFT JOIN application a ON a.role_id = r.id
			WHERE r.id = $1
			GROUP BY r.id, c.id, l.id, ct.id, a.id
			`,
			[id],
		);

		return roleDetails;
	} catch (error) {
		if (error instanceof errors.QueryResultError) {
			if (error.code === errors.queryResultErrorCode.noData) {
				throw new Error(`Role with id = ${id} does not exist.`);
			}
		}

		throw error;
	}
}

export const roleModel = {
	addRole,
	getRolePreviews,
	getRoleDetails,
};
