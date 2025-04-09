/** Types generated for queries found in "src/models/queries/admin/DeleteSessionById.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'DeleteSessionById' parameters type */
export interface IDeleteSessionByIdParams {
  id: string;
}

/** 'DeleteSessionById' return type */
export type IDeleteSessionByIdResult = void;

/** 'DeleteSessionById' query type */
export interface IDeleteSessionByIdQuery {
  params: IDeleteSessionByIdParams;
  result: IDeleteSessionByIdResult;
}

const deleteSessionByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":43}]}],"statement":"DELETE FROM hire_me.session\nWHERE id = :id !"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM hire_me.session
 * WHERE id = :id !
 * ```
 */
export const deleteSessionById = new PreparedQuery<IDeleteSessionByIdParams,IDeleteSessionByIdResult>(deleteSessionByIdIR);


