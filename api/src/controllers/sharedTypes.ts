import { RequestHandler as ExpressRequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";

interface ErrorResponseBody {
	error: string;
}

export type RequestHandler<
	ResBody = undefined,
	ReqBody = undefined,
> = ExpressRequestHandler<
	ParamsDictionary,
	ResBody | ErrorResponseBody,
	ReqBody
>;
