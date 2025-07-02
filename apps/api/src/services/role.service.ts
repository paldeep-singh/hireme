import Role, {
	RoleInitializer,
} from "@repo/api-types/generated/api/hire_me/Role";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { RoleUpdateInputShape } from "@repo/api-types/validators/Role";
import parseInterval from "postgres-interval";
import { RoleId } from "../db/generated/hire_me/Role";
import { roleModel } from "../models/role.model";
import { isoIntervalToPostgresInterval } from "../utils/isoIntervalToPostgresInterval";

async function addRole(role: RoleInitializer): Promise<Role> {
	const newRole = await roleModel.addRole({
		...role,
		term: role.term
			? parseInterval(isoIntervalToPostgresInterval(role.term))
			: null,
	});

	return {
		...newRole,
		term: newRole.term ? newRole.term.toISOString() : null,
		date_added: newRole.date_added.toISOString(),
	};
}

async function updateRole(
	updates: RoleUpdateInputShape,
	id: RoleId,
): Promise<Role> {
	const { term, ...rest } = updates;

	const updatedRole = await roleModel.updateRole(
		{
			...rest,
			...(term && {
				term: parseInterval(isoIntervalToPostgresInterval(term)),
			}),
		},
		id,
	);

	return {
		...updatedRole,
		term: updatedRole.term ? updatedRole.term.toISOString() : null,
		date_added: updatedRole.date_added.toISOString(),
	};
}

async function getRolePreviews(): Promise<RolePreview[]> {
	const rolePreviews = await roleModel.getRolePreviews();

	return rolePreviews.map((rp) => ({
		...rp,
		date_submitted: rp.date_submitted?.toISOString() ?? null,
		date_added: rp.date_added.toISOString(),
		term: rp.term ? rp.term.toISOString() : null,
	}));
}

async function getRoleDetails(id: RoleId): Promise<RoleDetails> {
	const { requirements, ...fetchedDetails } =
		await roleModel.getRoleDetails(id);

	const role = {
		id: fetchedDetails.id,
		ad_url: fetchedDetails.ad_url,
		date_added: fetchedDetails.date_added.toISOString(),
		notes: fetchedDetails.notes,
		title: fetchedDetails.title,
		type: fetchedDetails.type,
		term: fetchedDetails.term ? fetchedDetails.term.toISOString() : null,
	};

	const application: RoleDetails["application"] = fetchedDetails.application_id
		? {
				id: fetchedDetails.application_id,
				cover_letter: fetchedDetails.application_cover_letter,
				date_submitted:
					fetchedDetails.application_date_submitted?.toISOString() ?? null,
			}
		: null;

	const location: RoleDetails["location"] = fetchedDetails.location_id
		? {
				id: fetchedDetails.location_id,
				hybrid: fetchedDetails.location_hybrid!,
				location: fetchedDetails.location_name!,
				office_days: toNumrangeObject(fetchedDetails.location_office_days!),
				on_site: fetchedDetails.location_on_site!,
				remote: fetchedDetails.location_remote!,
			}
		: null;

	const company: RoleDetails["company"] = {
		id: fetchedDetails.company_id,
		name: fetchedDetails.company_name,
		notes: fetchedDetails.company_notes,
		website: fetchedDetails.company_website,
	};

	const salary: RoleDetails["salary"] = fetchedDetails.salary_id
		? {
				id: fetchedDetails.salary_id,
				salary_currency: fetchedDetails.salary_currency!,
				salary_includes_super: fetchedDetails.salary_includes_super!,
				salary_period: fetchedDetails.salary_salary_period!,
				salary_range: toNumrangeObject(fetchedDetails.salary_salary_range!),
			}
		: null;

	return {
		...role,
		application,
		location,
		company,
		salary,
		requirements,
	};
}

export const roleService = {
	addRole,
	updateRole,
	getRolePreviews,
	getRoleDetails,
};
