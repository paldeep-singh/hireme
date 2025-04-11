/** Types generated for queries found in "src/models/queries/role/GetRoleDetailsById.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

import type { NumRange } from '../../../db/types';

import type { IPostgresInterval } from 'postgres-interval';

export type contract_type = 'fixed_term' | 'permanent';

export type salary_period = 'day' | 'month' | 'week' | 'year';

/** 'GetRoleDetailsByRoleId' parameters type */
export interface IGetRoleDetailsByRoleIdParams {
  role_id: number;
}

/** 'GetRoleDetailsByRoleId' return type */
export interface IGetRoleDetailsByRoleIdResult {
  ad_url: string | null;
  application_id: number;
  company_id: number;
  company_name: string;
  company_notes: string | null;
  company_website: string | null;
  contract_id: number;
  contract_type: contract_type;
  cover_letter: string;
  date_added: Date;
  date_submitted: Date | null;
  hybrid: boolean;
  location: string;
  location_id: number;
  notes: string | null;
  on_site: boolean;
  remote: boolean;
  role_id: number;
  salary_currency: string | null;
  salary_includes_super: boolean | null;
  salary_period: salary_period | null;
  salary_range: NumRange | null;
  term: IPostgresInterval | null;
  title: string;
}

/** 'GetRoleDetailsByRoleId' query type */
export interface IGetRoleDetailsByRoleIdQuery {
  params: IGetRoleDetailsByRoleIdParams;
  result: IGetRoleDetailsByRoleIdResult;
}

const getRoleDetailsByRoleIdIR: any = {"usedParamSet":{"role_id":true},"params":[{"name":"role_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":685,"b":694}]}],"statement":"SELECT\n\tr.id as role_id,\n\tr.title,\n\tr.ad_url,\n\tr.notes,\n\tr.date_added,\n\tr.company_id,\n\tc.name as company_name,\n\tc.notes as company_notes,\n\tc.website as company_website,\n\tl.id as location_id,\n\tl.location,\n\tl.on_site,\n\tl.hybrid,\n\tl.remote,\n\tct.id as contract_id,\n\tct.type as contract_type,\n\tct.salary_range,\n\tct.salary_includes_super,\n\tct.salary_period,\n\tct.salary_currency,\n\tct.term,\n\ta.id as application_id,\n\ta.cover_letter,\n\ta.date_submitted\nFROM\n\thire_me.role r\n\tJOIN hire_me.company c ON c.id = r.company_id\n\tLEFT JOIN hire_me.role_location l ON l.role_id = r.id\n\tLEFT JOIN hire_me.contract ct ON ct.role_id = r.id\n\tLEFT JOIN hire_me.application a ON a.role_id = r.id\nWHERE\n\tr.id = :role_id !"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	r.id as role_id,
 * 	r.title,
 * 	r.ad_url,
 * 	r.notes,
 * 	r.date_added,
 * 	r.company_id,
 * 	c.name as company_name,
 * 	c.notes as company_notes,
 * 	c.website as company_website,
 * 	l.id as location_id,
 * 	l.location,
 * 	l.on_site,
 * 	l.hybrid,
 * 	l.remote,
 * 	ct.id as contract_id,
 * 	ct.type as contract_type,
 * 	ct.salary_range,
 * 	ct.salary_includes_super,
 * 	ct.salary_period,
 * 	ct.salary_currency,
 * 	ct.term,
 * 	a.id as application_id,
 * 	a.cover_letter,
 * 	a.date_submitted
 * FROM
 * 	hire_me.role r
 * 	JOIN hire_me.company c ON c.id = r.company_id
 * 	LEFT JOIN hire_me.role_location l ON l.role_id = r.id
 * 	LEFT JOIN hire_me.contract ct ON ct.role_id = r.id
 * 	LEFT JOIN hire_me.application a ON a.role_id = r.id
 * WHERE
 * 	r.id = :role_id !
 * ```
 */
export const getRoleDetailsByRoleId = new PreparedQuery<IGetRoleDetailsByRoleIdParams,IGetRoleDetailsByRoleIdResult>(getRoleDetailsByRoleIdIR);


