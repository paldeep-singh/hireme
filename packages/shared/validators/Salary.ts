import { z } from "zod";
import {
	SalaryId,
	SalaryInitializer,
	SalaryMutator,
} from "../generated/api/hire_me/Salary.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { roleId } from "./Role.js";
import { salaryPeriod } from "./SalaryPeriod.js";

export const salaryId = z.number().transform((value) => value as SalaryId);

export type SalaryInput = OmitStrict<SalaryInitializer, "role_id">;

export type SalaryUpdateInput = OmitStrict<SalaryMutator, "role_id">;

export const salaryInputShape: ZodShape<SalaryInput> = {
	salary_range: z.object({
		min: z.number().nullable(),
		max: z.number().nullable(),
	}),
	salary_includes_super: z.boolean(),
	salary_period: salaryPeriod,
	salary_currency: z.string().min(1),
};

export const salaryUpdateInputShape: ZodShape<SalaryUpdateInput> = {
	salary_range: z
		.object({
			min: z.number().nullable(),
			max: z.number().nullable(),
		})
		.optional(),
	salary_includes_super: z.boolean().optional(),
	salary_period: salaryPeriod.optional(),
	salary_currency: z.string().min(1).optional(),
};

export const salaryInitializerShape: ZodShape<SalaryInitializer> = {
	...salaryInputShape,
	role_id: roleId,
};

export const salaryInputSchema = z.object(salaryInputShape);

export const salaryUpdateInputSchema = z.object(salaryInputShape).strict();

export const salaryInitializerSchema = z.object(salaryInitializerShape);
