/** Types generated for queries found in "src/models/queries/requirement/GetRequirementsByRoleId.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetRequirementsByRoleId' parameters type */
export interface IGetRequirementsByRoleIdParams {
  role_id: number;
}

/** 'GetRequirementsByRoleId' return type */
export interface IGetRequirementsByRoleIdResult {
  bonus: boolean;
  description: string;
  id: number;
}

/** 'GetRequirementsByRoleId' query type */
export interface IGetRequirementsByRoleIdQuery {
  params: IGetRequirementsByRoleIdParams;
  result: IGetRequirementsByRoleIdResult;
}

const getRequirementsByRoleIdIR: any = {"usedParamSet":{"role_id":true},"params":[{"name":"role_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":89}]}],"statement":"SELECT\n\tid,\n\tdescription,\n\tbonus\nFROM\n\thire_me.requirement r\nWHERE\n\tr.role_id = :role_id !"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	id,
 * 	description,
 * 	bonus
 * FROM
 * 	hire_me.requirement r
 * WHERE
 * 	r.role_id = :role_id !
 * ```
 */
export const getRequirementsByRoleId = new PreparedQuery<IGetRequirementsByRoleIdParams,IGetRequirementsByRoleIdResult>(getRequirementsByRoleIdIR);


