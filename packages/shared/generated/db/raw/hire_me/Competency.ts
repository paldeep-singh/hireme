// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ApplicationId } from "./Application.js";
import type { RequirementId } from "./Requirement.js";
import type { default as RequirementMatchLevel } from "./RequirementMatchLevel.js";

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
