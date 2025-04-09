/** Types generated for queries found in "src/models/queries/company/GetCompanies.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetCompanies' parameters type */
export type IGetCompaniesParams = void;

/** 'GetCompanies' return type */
export interface IGetCompaniesResult {
  id: number;
  name: string;
  notes: string | null;
  website: string | null;
}

/** 'GetCompanies' query type */
export interface IGetCompaniesQuery {
  params: IGetCompaniesParams;
  result: IGetCompaniesResult;
}

const getCompaniesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n\tid,\n\tname,\n\tnotes,\n\twebsite\nFROM\n\thire_me.company\nORDER BY\n\tname"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	id,
 * 	name,
 * 	notes,
 * 	website
 * FROM
 * 	hire_me.company
 * ORDER BY
 * 	name
 * ```
 */
export const getCompanies = new PreparedQuery<IGetCompaniesParams,IGetCompaniesResult>(getCompaniesIR);


