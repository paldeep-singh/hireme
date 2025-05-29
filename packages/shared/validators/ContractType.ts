import { z } from "zod";
import ContractType from "../generated/api/hire_me/ContractType.js";

export const contractType = z.enum([
	"permanent",
	"fixed_term",
]) satisfies z.ZodType<ContractType>;
