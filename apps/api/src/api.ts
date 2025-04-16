import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import { errorHandler } from "./middleware/errorHandler";
import { adminRouter } from "./routes/admin.route";
import { companyRouter } from "./routes/company.route";
import { requirementRouter } from "./routes/requirement.route";
import { roleRouter } from "./routes/role.route";
import { testErrorsRouter } from "./routes/test-errors.route";

dotenv.config();

const router = Router();

router.use(companyRouter);
router.use(roleRouter);
router.use(requirementRouter);
router.use(adminRouter);

if (process.env.ENV === "test") {
	router.use(testErrorsRouter);
}

const { CORS_ORIGIN } = process.env;

if (!CORS_ORIGIN) {
	throw new Error("CORS_ORIGIN is not set");
}

const api = express();
api.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	}),
);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(cookieParser());

api.use("/api", router);

api.use(errorHandler);

export default api;
