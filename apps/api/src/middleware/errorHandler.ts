import { ErrorRequestHandler } from "express-serve-static-core";
import { ReasonPhrases } from "http-status-codes";
import { AppError } from "../utils/errors";

export const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({ error: err.message });
		return;
	}

	// eslint-disable-next-line no-console
	console.error("Unexpected error:", JSON.stringify(err), null, 4);
	res.status(500).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
};
