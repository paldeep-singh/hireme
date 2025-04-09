/** Types generated for queries found in "src/models/queries/admin/GetAdminByEmail.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetAdminByEmail' parameters type */
export interface IGetAdminByEmailParams {
  email: string;
}

/** 'GetAdminByEmail' return type */
export interface IGetAdminByEmailResult {
  email: string;
  id: number;
  password_hash: string;
}

/** 'GetAdminByEmail' query type */
export interface IGetAdminByEmailQuery {
  params: IGetAdminByEmailParams;
  result: IGetAdminByEmailResult;
}

const getAdminByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":77}]}],"statement":"SELECT\n\tid,\n\temail,\n\tpassword_hash\nFROM\n\thire_me.admin\nWHERE\n\temail = :email !"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 * 	id,
 * 	email,
 * 	password_hash
 * FROM
 * 	hire_me.admin
 * WHERE
 * 	email = :email !
 * ```
 */
export const getAdminByEmail = new PreparedQuery<IGetAdminByEmailParams,IGetAdminByEmailResult>(getAdminByEmailIR);


