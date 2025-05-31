import { CompanyId } from "@repo/api-types/generated/api/hire_me/Company";
import { RoleId } from "@repo/api-types/generated/api/hire_me/Role";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AddRoleContext } from "../../../forms/contexts/AddRoleContext";

export const Route = createFileRoute("/(authed)/add-role")({
	component: AddRoleLayout,
});

function AddRoleLayout() {
	const [companyId, setCompanyId] = useState<CompanyId | null>(null);
	const [roleId, setRoleId] = useState<RoleId | null>(null);

	return (
		<AddRoleContext.Provider
			value={{
				companyId,
				roleId,
				setCompanyId,
				setRoleId,
			}}
		>
			<Outlet />
		</AddRoleContext.Provider>
	);
}
