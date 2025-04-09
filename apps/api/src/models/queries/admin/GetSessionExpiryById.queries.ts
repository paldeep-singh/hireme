/** Types generated for queries found in "src/models/queries/admin/GetSessionExpiryById.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetSessionExpiryById' parameters type */
export interface IGetSessionExpiryByIdParams {
  id: string;
}

/** 'GetSessionExpiryById' return type */
export interface IGetSessionExpiryByIdResult {
  expiry: Date;
}

/** 'GetSessionExpiryById' query type */
export interface IGetSessionExpiryByIdQuery {
  params: IGetSessionExpiryByIdParams;
  result: IGetSessionExpiryByIdResult;
}

const getSessionExpiryByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":49,"b":53}]}],"statement":"SELECT\n\texpiry\nFROM\n\thire_me.session\nWHERE\n\tid = :id !"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	expiry
 * FROM
 * 	hire_me.session
 * WHERE
 * 	id = :id !
 * ```
 */
export const getSessionExpiryById = new PreparedQuery<IGetSessionExpiryByIdParams,IGetSessionExpiryByIdResult>(getSessionExpiryByIdIR);


