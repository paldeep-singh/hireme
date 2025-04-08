// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for hire_me.company */
export type CompanyId = number & { __brand: "CompanyId" };

/** Represents the table hire_me.company */
export default interface DBCompany {
	id: CompanyId;

	name: string;

	notes: string | null;

	website: string | null;
}

/** Represents the initializer for the table hire_me.company */
export interface DBCompanyInitializer {
	name: string;

	notes?: string | null;

	website?: string | null;
}

/** Represents the mutator for the table hire_me.company */
export interface DBCompanyMutator {
	name?: string;

	notes?: string | null;

	website?: string | null;
}
