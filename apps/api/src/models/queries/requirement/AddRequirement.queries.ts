/** Types generated for queries found in "src/models/queries/requirement/AddRequirement.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'AddRequirement' parameters type */
export interface IAddRequirementParams {
  bonus: boolean;
  description: string;
  role_id: number;
}

/** 'AddRequirement' return type */
export interface IAddRequirementResult {
  bonus: boolean;
  description: string;
  id: number;
  role_id: number;
}

/** 'AddRequirement' query type */
export interface IAddRequirementQuery {
  params: IAddRequirementParams;
  result: IAddRequirementResult;
}

const addRequirementIR: any = {"usedParamSet":{"role_id":true,"bonus":true,"description":true},"params":[{"name":"role_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":80}]},{"name":"bonus","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":90}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":93,"b":106}]}],"statement":"INSERT INTO hire_me.requirement (role_id, bonus, description)\n\tVALUES (:role_id !, :bonus !, :description !)\nRETURNING\n\tid, role_id, bonus, description"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO hire_me.requirement (role_id, bonus, description)
 * 	VALUES (:role_id !, :bonus !, :description !)
 * RETURNING
 * 	id, role_id, bonus, description
 * ```
 */
export const addRequirement = new PreparedQuery<IAddRequirementParams,IAddRequirementResult>(addRequirementIR);


