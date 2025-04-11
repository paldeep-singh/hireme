// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for hire_me.company */
export type CompanyId = number & { __brand: 'CompanyId' };

/** Represents the table hire_me.company */
export default interface CompanyTable {
  id: ColumnType<CompanyId, never, never>;

  name: ColumnType<string, string, string>;

  notes: ColumnType<string | null, string | null, string | null>;

  website: ColumnType<string | null, string | null, string | null>;
}

export type Company = Selectable<CompanyTable>;

export type NewCompany = Insertable<CompanyTable>;

export type CompanyUpdate = Updateable<CompanyTable>;
