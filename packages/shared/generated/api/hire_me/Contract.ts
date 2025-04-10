// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";
import { NumRange } from "../../../types/api/Ranges.js";
import { contractType, type default as ContractType } from "./ContractType.js";
import { roleId, type RoleId } from "./Role.js";
import { salaryPeriod, type default as SalaryPeriod } from "./SalaryPeriod.js";

/** Identifier type for hire_me.contract */
export type ContractId = number & { __brand: "ContractId" };

/** Represents the table hire_me.contract */
export default interface Contract {
	id: ContractId;

	role_id: RoleId;

	type: ContractType;

	salary_range: NumRange | null;

	salary_includes_super: boolean | null;

	salary_period: SalaryPeriod | null;

	salary_currency: string | null;

	term: string | null;
}

/** Represents the initializer for the table hire_me.contract */
export interface ContractInitializer {
	role_id: RoleId;

	type: ContractType;

	salary_range?: NumRange | null;

	salary_includes_super?: boolean | null;

	salary_period?: SalaryPeriod | null;

	salary_currency?: string | null;

	term?: string | null;
}

/** Represents the mutator for the table hire_me.contract */
export interface ContractMutator {
	role_id?: RoleId;

	type?: ContractType;

	salary_range?: NumRange | null;

	salary_includes_super?: boolean | null;

	salary_period?: SalaryPeriod | null;

	salary_currency?: string | null;

	term?: string | null;
}

export const contractId = z.number() as unknown as z.Schema<ContractId>;

export const contract = z.object({
	id: contractId,
	role_id: roleId,
	type: contractType,
	salary_range: z
		.object({
			min: z.number().nullable(),
			max: z.number().nullable(),
		})
		.nullable(),
	salary_includes_super: z.boolean().nullable(),
	salary_period: salaryPeriod.nullable(),
	salary_currency: z.string().nullable(),
	term: z.string().duration().nullable(),
}) as unknown as z.Schema<Contract>;

export const contractInitializer = z.object({
	id: contractId.optional(),
	role_id: roleId,
	type: contractType,
	salary_range: z
		.object({
			min: z.number().nullable(),
			max: z.number().nullable(),
		})
		.optional()
		.nullable(),
	salary_includes_super: z.boolean().optional().nullable(),
	salary_period: salaryPeriod.optional().nullable(),
	salary_currency: z.string().optional().nullable(),
	term: z.string().duration().optional().nullable(),
}) as unknown as z.Schema<ContractInitializer>;

export const contractMutator = z.object({
	id: contractId.optional(),
	role_id: roleId.optional(),
	type: contractType.optional(),
	salary_range: z
		.object({
			min: z.number().nullable(),
			max: z.number().nullable(),
		})
		.optional()
		.nullable(),
	salary_includes_super: z.boolean().optional().nullable(),
	salary_period: salaryPeriod.optional().nullable(),
	salary_currency: z.string().optional().nullable(),
	term: z.string().duration().optional().nullable(),
}) as unknown as z.Schema<ContractMutator>;
