/** Types generated for queries found in "src/models/queries/company/AddCompany.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'AddCompany' parameters type */
export interface IAddCompanyParams {
  name: string;
  notes?: string | null | void;
  website?: string | null | void;
}

/** 'AddCompany' return type */
export interface IAddCompanyResult {
  id: number;
  name: string;
  notes: string | null;
  website: string | null;
}

/** 'AddCompany' query type */
export interface IAddCompanyQuery {
  params: IAddCompanyParams;
  result: IAddCompanyResult;
}

const addCompanyIR: any = {"usedParamSet":{"name":true,"notes":true,"website":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":60,"b":66}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":69,"b":74}]},{"name":"website","required":false,"transform":{"type":"scalar"},"locs":[{"a":77,"b":84}]}],"statement":"INSERT INTO hire_me.company (name, notes, website)\n\tVALUES (:name !, :notes, :website)\nRETURNING\n\tid, name, notes, website"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO hire_me.company (name, notes, website)
 * 	VALUES (:name !, :notes, :website)
 * RETURNING
 * 	id, name, notes, website
 * ```
 */
export const addCompany = new PreparedQuery<IAddCompanyParams,IAddCompanyResult>(addCompanyIR);


