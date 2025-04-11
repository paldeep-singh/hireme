// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { RoleId } from './Role';
import { Range } from 'postgres-range';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for hire_me.role_location */
export type RoleLocationId = number & { __brand: 'RoleLocationId' };

/** Represents the table hire_me.role_location */
export default interface RoleLocationTable {
  id: ColumnType<RoleLocationId, never, never>;

  role_id: ColumnType<RoleId, RoleId, RoleId>;

  location: ColumnType<string, string, string>;

  on_site: ColumnType<boolean, boolean, boolean>;

  hybrid: ColumnType<boolean, boolean, boolean>;

  remote: ColumnType<boolean, boolean, boolean>;

  office_days: ColumnType<Range<number> | null, Range<number> | null, Range<number> | null>;
}

export type RoleLocation = Selectable<RoleLocationTable>;

export type NewRoleLocation = Insertable<RoleLocationTable>;

export type RoleLocationUpdate = Updateable<RoleLocationTable>;
