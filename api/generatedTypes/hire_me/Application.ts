// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { RoleId } from './Role';

/** Identifier type for hire_me.application */
export type ApplicationId = number & { __brand: 'ApplicationId' };

/** Represents the table hire_me.application */
export default interface Application {
  id: ApplicationId;

  role_id: RoleId;

  code_hash: string;

  cover_letter: string;
}

/** Represents the initializer for the table hire_me.application */
export interface ApplicationInitializer {
  role_id: RoleId;

  code_hash: string;

  cover_letter: string;
}

/** Represents the mutator for the table hire_me.application */
export interface ApplicationMutator {
  role_id?: RoleId;

  code_hash?: string;

  cover_letter?: string;
}
