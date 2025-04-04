// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";
import { applicationId, type ApplicationId } from "./Application.js";
import { requirementId, type RequirementId } from "./Requirement.js";
import {
	requirementMatchLevel,
	type default as RequirementMatchLevel,
} from "./RequirementMatchLevel.js";

/** Identifier type for hire_me.competency */
export type CompetencyId = number & { __brand: "CompetencyId" };

/** Represents the table hire_me.competency */
export default interface Competency {
	id: CompetencyId;

	application_id: ApplicationId;

	requirement_id: RequirementId;

	match_level: RequirementMatchLevel;

	match_justification: string;
}

/** Represents the initializer for the table hire_me.competency */
export interface CompetencyInitializer {
	application_id: ApplicationId;

	requirement_id: RequirementId;

	match_level: RequirementMatchLevel;

	match_justification: string;
}

/** Represents the mutator for the table hire_me.competency */
export interface CompetencyMutator {
	application_id?: ApplicationId;

	requirement_id?: RequirementId;

	match_level?: RequirementMatchLevel;

	match_justification?: string;
}

export const competencyId = z.number() as unknown as z.Schema<CompetencyId>;

export const competency = z.object({
	id: competencyId,
	application_id: applicationId,
	requirement_id: requirementId,
	match_level: requirementMatchLevel,
	match_justification: z.string(),
}) as unknown as z.Schema<Competency>;

export const competencyInitializer = z.object({
	id: competencyId.optional(),
	application_id: applicationId,
	requirement_id: requirementId,
	match_level: requirementMatchLevel,
	match_justification: z.string(),
}) as unknown as z.Schema<CompetencyInitializer>;

export const competencyMutator = z.object({
	id: competencyId.optional(),
	application_id: applicationId.optional(),
	requirement_id: requirementId.optional(),
	match_level: requirementMatchLevel.optional(),
	match_justification: z.string().optional(),
}) as unknown as z.Schema<CompetencyMutator>;
