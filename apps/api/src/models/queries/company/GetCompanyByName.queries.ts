/** Types generated for queries found in "src/models/queries/company/GetCompanyByName.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetCompanyByName' parameters type */
export interface IGetCompanyByNameParams {
  name: string;
}

/** 'GetCompanyByName' return type */
export interface IGetCompanyByNameResult {
  id: number;
  name: string;
}

/** 'GetCompanyByName' query type */
export interface IGetCompanyByNameQuery {
  params: IGetCompanyByNameParams;
  result: IGetCompanyByNameResult;
}

const getCompanyByNameIR: any = {"usedParamSet":{"name":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":60}]}],"statement":"SELECT\n\tid,\n\tname\nFROM\n\thire_me.company\nWHERE\n\tname = :name !"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	id,
 * 	name
 * FROM
 * 	hire_me.company
 * WHERE
 * 	name = :name !
 * ```
 */
export const getCompanyByName = new PreparedQuery<IGetCompanyByNameParams,IGetCompanyByNameResult>(getCompanyByNameIR);


