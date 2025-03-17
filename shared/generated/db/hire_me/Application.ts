// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { roleId, type RoleId } from "./Role.js";
import { z } from "zod";

/** Identifier type for hire_me.application */
export type ApplicationId = number & { __brand: "ApplicationId" };

/** Represents the table hire_me.application */
export default interface Application {
  id: ApplicationId;

  role_id: RoleId;

  cover_letter: string;

  submitted: boolean;
}

/** Represents the initializer for the table hire_me.application */
export interface ApplicationInitializer {
  role_id: RoleId;

  cover_letter: string;

  submitted: boolean;
}

/** Represents the mutator for the table hire_me.application */
export interface ApplicationMutator {
  role_id?: RoleId;

  cover_letter?: string;

  submitted?: boolean;
}

export const applicationId = z.number() as unknown as z.Schema<ApplicationId>;

export const application = z.object({
  id: applicationId,
  role_id: roleId,
  cover_letter: z.string(),
  submitted: z.boolean(),
}) as unknown as z.Schema<Application>;

export const applicationInitializer = z.object({
  id: applicationId.optional(),
  role_id: roleId,
  cover_letter: z.string(),
  submitted: z.boolean(),
}) as unknown as z.Schema<ApplicationInitializer>;

export const applicationMutator = z.object({
  id: applicationId.optional(),
  role_id: roleId.optional(),
  cover_letter: z.string().optional(),
  submitted: z.boolean().optional(),
}) as unknown as z.Schema<ApplicationMutator>;
