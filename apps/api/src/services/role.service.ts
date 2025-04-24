import Role from "@repo/api-types/generated/api/hire_me/Role";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { toNumrangeString } from "@repo/api-types/utils/toNumrangeString";
import { NewRole, RoleId } from "../db/generated/hire_me/Role";
import { roleModel } from "../models/role.model";

async function addRole(role: NewRole): Promise<Role> {
	const newRole = await roleModel.addRole(role);

	return {
		...newRole,
		date_added: newRole.date_added.toISOString(),
	};
}

async function getRolePreviews(): Promise<RolePreview[]> {
	const rolePreviews = await roleModel.getRolePreviews();

	return rolePreviews.map((rp) => ({
		...rp,
		date_submitted: rp.date_submitted?.toISOString() ?? null,
		date_added: rp.date_added.toISOString(),
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
				office_days: toNumrangeString(fetchedDetails.location_office_days!),
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

	const contract: RoleDetails["contract"] = fetchedDetails.contract_id
		? {
				id: fetchedDetails.contract_id,
				salary_currency: fetchedDetails.contract_currency,
				salary_includes_super: fetchedDetails.contract_includes_super,
				salary_period: fetchedDetails.contract_salary_period,
				salary_range: toNumrangeString(fetchedDetails.contract_salary_range),
				term: fetchedDetails.contract_term?.toISOString() ?? null,
				type: fetchedDetails.contract_type!,
			}
		: null;

	return {
		...role,
		application,
		location,
		company,
		contract,
		requirements,
	};
}

export const roleService = {
	addRole,
	getRolePreviews,
	getRoleDetails,
};
