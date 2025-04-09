/** Types generated for queries found in "src/models/queries/role/GetRolePreviews.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetRolePreviews' parameters type */
export type IGetRolePreviewsParams = void;

/** 'GetRolePreviews' return type */
export interface IGetRolePreviewsResult {
  ad_url: string | null;
  company: string;
  company_id: number;
  date_added: Date;
  date_submitted: Date | null;
  id: number;
  location: string;
  notes: string | null;
  title: string;
}

/** 'GetRolePreviews' query type */
export interface IGetRolePreviewsQuery {
  params: IGetRolePreviewsParams;
  result: IGetRolePreviewsResult;
}

const getRolePreviewsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n\tr.id,\n\tr.company_id,\n\tr.title,\n\tr.ad_url,\n\tr.notes,\n\tr.date_added,\n\tc.name AS company,\n\trl.location,\n\ta.date_submitted\nFROM\n\thire_me.role r\n\tJOIN hire_me.company c ON r.company_id = c.id\n\tLEFT JOIN hire_me.role_location rl ON rl.role_id = r.id\n\tLEFT JOIN hire_me.application a ON a.role_id = r.id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	r.id,
 * 	r.company_id,
 * 	r.title,
 * 	r.ad_url,
 * 	r.notes,
 * 	r.date_added,
 * 	c.name AS company,
 * 	rl.location,
 * 	a.date_submitted
 * FROM
 * 	hire_me.role r
 * 	JOIN hire_me.company c ON r.company_id = c.id
 * 	LEFT JOIN hire_me.role_location rl ON rl.role_id = r.id
 * 	LEFT JOIN hire_me.application a ON a.role_id = r.id
 * ```
 */
export const getRolePreviews = new PreparedQuery<IGetRolePreviewsParams,IGetRolePreviewsResult>(getRolePreviewsIR);


