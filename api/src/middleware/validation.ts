import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodError } from "zod";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export function validateRequestBody<Schema extends z.Schema>(
  schema: Schema
): RequestHandler {
  // never is used in Request params as we do not need to know the types of the request parameters
  // or the response body at the moment.
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  };
}
