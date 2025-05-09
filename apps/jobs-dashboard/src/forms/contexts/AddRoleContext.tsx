import { CompanyId } from "@repo/api-types/generated/api/hire_me/Company";
import { RoleId } from "@repo/api-types/generated/api/hire_me/Role";
import { createContext, useContext } from "react";

interface AddRoleContextType {
	companyId: CompanyId | null;
	roleId: RoleId | null;
	setCompanyId: (id: CompanyId | null) => void;
	setRoleId: (id: RoleId | null) => void;
}

export const useAddRoleContext = () => {
	const context = useContext(AddRoleContext);
	if (!context) {
		throw new Error("useAddRole must be used within a AddRoleProvider");
	}
	return context;
};

export const AddRoleContext = createContext<AddRoleContextType | undefined>(
	undefined,
);
