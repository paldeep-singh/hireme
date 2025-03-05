import { RequestHandler as ExpressRequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";

type ErrorResponseBody = { error: string };

export type RequestHandler<ResBody, ReqBody = object> = ExpressRequestHandler<
  ParamsDictionary,
  ResBody | ErrorResponseBody,
  ReqBody
>;
