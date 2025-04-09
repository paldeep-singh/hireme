/** Types generated for queries found in "src/models/queries/admin/AddSession.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

/** 'AddSession' parameters type */
export interface IAddSessionParams {
  admin_id: number;
  expiry: DateOrString;
  id: string;
}

/** 'AddSession' return type */
export interface IAddSessionResult {
  expiry: Date;
  id: string;
}

/** 'AddSession' query type */
export interface IAddSessionQuery {
  params: IAddSessionParams;
  result: IAddSessionResult;
}

const addSessionIR: any = {"usedParamSet":{"id":true,"expiry":true,"admin_id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":60,"b":64}]},{"name":"expiry","required":true,"transform":{"type":"scalar"},"locs":[{"a":67,"b":75}]},{"name":"admin_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":78,"b":88}]}],"statement":"INSERT INTO hire_me.session (id, expiry, admin_id)\n\tVALUES (:id !, :expiry !, :admin_id !)\nRETURNING\n\tid, expiry"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO hire_me.session (id, expiry, admin_id)
 * 	VALUES (:id !, :expiry !, :admin_id !)
 * RETURNING
 * 	id, expiry
 * ```
 */
export const addSession = new PreparedQuery<IAddSessionParams,IAddSessionResult>(addSessionIR);


