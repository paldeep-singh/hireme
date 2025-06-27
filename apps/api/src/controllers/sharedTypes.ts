import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

interface ErrorResponseBody {
	error: string;
}

export interface TypedRequest<
	ReqBody = undefined,
	ResBody = undefined,
	ParsedParams = undefined,
> extends Request<ParamsDictionary, ResBody | ErrorResponseBody, ReqBody> {
	parsedParams: ParsedParams;
}

export type RequestHandler<
	ResBody = undefined,
	ReqBody = undefined,
	ParsedParams = undefined,
> = (
	req: TypedRequest<ResBody, ReqBody, ParsedParams>,
	res: Response<ResBody | ErrorResponseBody>,
	next: NextFunction,
) => void;
