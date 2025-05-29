import { z } from "zod";
import {
	CompanyId,
	CompanyInitializer,
} from "../generated/api/hire_me/Company.js";
import { ZodShape } from "../utils/zod.js";

export const companyId = z.number().transform((val) => val as CompanyId);

export type CompanyInput = CompanyInitializer;

const companyInputShape: ZodShape<CompanyInput> = {
	name: z.string().min(1),
	notes: z.string().min(1).nullable().optional(),
	website: z.string().url().nullable().optional(),
};

export const companyInputSchema = z.object(companyInputShape);

const companyInitializerShape: ZodShape<CompanyInitializer> = companyInputShape;

export const companyInitializerSchema = z.object(companyInitializerShape);
