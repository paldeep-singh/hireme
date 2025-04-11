// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { AdminId } from './Admin';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for hire_me.session */
export type SessionId = string & { __brand: 'SessionId' };

/** Represents the table hire_me.session */
export default interface SessionTable {
  id: ColumnType<SessionId, SessionId, SessionId>;

  expiry: ColumnType<Date, Date | string, Date | string>;

  admin_id: ColumnType<AdminId, AdminId, AdminId>;
}

export type Session = Selectable<SessionTable>;

export type NewSession = Insertable<SessionTable>;

export type SessionUpdate = Updateable<SessionTable>;
