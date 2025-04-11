/** Types generated for queries found in "src/models/queries/role/AddRole.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'AddRole' parameters type */
export interface IAddRoleParams {
  ad_url?: string | null | void;
  company_id: number;
  notes?: string | null | void;
  title: string;
}

/** 'AddRole' return type */
export interface IAddRoleResult {
  ad_url: string | null;
  company_id: number;
  date_added: Date;
  id: number;
  notes: string | null;
  title: string;
}

/** 'AddRole' query type */
export interface IAddRoleQuery {
  params: IAddRoleParams;
  result: IAddRoleResult;
}

const addRoleIR: any = {"usedParamSet":{"company_id":true,"title":true,"notes":true,"ad_url":true},"params":[{"name":"company_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":81}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":84,"b":91}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":94,"b":99}]},{"name":"ad_url","required":false,"transform":{"type":"scalar"},"locs":[{"a":102,"b":108}]}],"statement":"INSERT INTO hire_me.role (company_id, title, notes, ad_url)\n\tVALUES (:company_id !, :title !, :notes, :ad_url)\nRETURNING\n\tid, company_id, title, notes, ad_url, date_added"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO hire_me.role (company_id, title, notes, ad_url)
 * 	VALUES (:company_id !, :title !, :notes, :ad_url)
 * RETURNING
 * 	id, company_id, title, notes, ad_url, date_added
 * ```
 */
export const addRole = new PreparedQuery<IAddRoleParams,IAddRoleResult>(addRoleIR);


