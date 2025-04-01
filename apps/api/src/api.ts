import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import { adminRouter } from "./routes/admin";
import { companyRouter } from "./routes/company";
import { requirementRouter } from "./routes/requirement";
import { roleRouter } from "./routes/role";

dotenv.config();

const router = Router();

router.use(companyRouter);
router.use(roleRouter);
router.use(requirementRouter);
router.use(adminRouter);

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

export default api;
