// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { Range } from "postgres-range";
import type { DBRoleId } from "./Role.js";

/** Identifier type for hire_me.role_location */
export type DBRoleLocationId = number & { __brand: "RoleLocationId" };

/** Represents the table hire_me.role_location */
export default interface DBRoleLocation {
	id: DBRoleLocationId;

	role_id: DBRoleId;

	location: string;

	on_site: boolean;

	hybrid: boolean;

	remote: boolean;

	office_days: Range<number> | null;
}

/** Represents the initializer for the table hire_me.role_location */
export interface DBRoleLocationInitializer {
	role_id: DBRoleId;

	location: string;

	on_site: boolean;

	hybrid: boolean;

	remote: boolean;

	office_days?: Range<number> | null;
}

/** Represents the mutator for the table hire_me.role_location */
export interface DBRoleLocationMutator {
	role_id?: DBRoleId;

	location?: string;

	on_site?: boolean;

	hybrid?: boolean;

	remote?: boolean;

	office_days?: Range<number> | null;
}
