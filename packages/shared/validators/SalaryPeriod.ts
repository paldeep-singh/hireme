import { z } from "zod";
import SalaryPeriod from "../generated/api/hire_me/SalaryPeriod.js";

/** Zod schema for salary_period */
export const salaryPeriod = z.enum([
	"year",
	"month",
	"week",
	"day",
]) satisfies z.ZodType<SalaryPeriod>;
