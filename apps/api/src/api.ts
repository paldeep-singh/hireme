import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import { errorHandler } from "./middleware/errorHandler";
import { adminRouter } from "./routes/admin.route";
import { applicationRouter } from "./routes/application.route";
import { companyRouter } from "./routes/company.route";
import { requirementRouter } from "./routes/requirement.route";
import { roleLocationRouter } from "./routes/role-location.route";
import { roleRouter } from "./routes/role.route";
import { salaryRouter } from "./routes/salary.route";
import { testErrorsRouter } from "./routes/test-errors.route";

dotenv.config();

const router = Router();

router.use(companyRouter);
router.use(roleRouter);
router.use(requirementRouter);
router.use(adminRouter);
router.use(roleLocationRouter);
router.use(salaryRouter);
router.use(applicationRouter);

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

if (process.env.NODE_ENV === "prod") {
	api.use(
		"/dashboard",
		express.static(path.join(__dirname, "public", "dashboard")),
	);

	api.get(/^\/dashboard(\/.*)?$/, (_, res) => {
		res.sendFile(path.join(__dirname, "public", "dashboard", "index.html"));
	});
}

api.use(errorHandler);

export default api;
