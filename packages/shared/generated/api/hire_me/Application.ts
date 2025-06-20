// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { RoleId } from "./Role.js";

/** Identifier type for hire_me.application */
export type ApplicationId = number & { __brand: "ApplicationId" };

/** Represents the table hire_me.application */
export default interface Application {
	id: ApplicationId;

	role_id: RoleId;

	cover_letter: string | null;

	date_submitted: string | null;
}

/** Represents the initializer for the table hire_me.application */
export interface ApplicationInitializer {
	role_id: RoleId;

	cover_letter?: string | null;

	date_submitted?: string | null;
}

/** Represents the mutator for the table hire_me.application */
export interface ApplicationMutator {
	role_id?: RoleId;

	cover_letter?: string | null;

	date_submitted?: string | null;
}
