import { z } from "zod";
import RequirementMatchLevel from "../generated/api/hire_me/RequirementMatchLevel.js";

export const requirementMatchLevel = z.enum([
	"exceeded",
	"met",
	"room_for_growth",
]) satisfies z.ZodType<RequirementMatchLevel>;
