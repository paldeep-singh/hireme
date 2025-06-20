// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { RoleId } from "./Role";

/** Identifier type for hire_me.requirement */
export type RequirementId = number & { __brand: "RequirementId" };

/** Represents the table hire_me.requirement */
export default interface RequirementTable {
	id: ColumnType<RequirementId, never, never>;

	role_id: ColumnType<RoleId, RoleId, RoleId>;

	description: ColumnType<string, string, string>;

	bonus: ColumnType<boolean, boolean, boolean>;
}

export type Requirement = Selectable<RequirementTable>;

export type NewRequirement = Insertable<RequirementTable>;

export type RequirementUpdate = Updateable<RequirementTable>;
