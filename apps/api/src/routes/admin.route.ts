import { adminCredentials } from "@repo/api-types/validators/Admin";
import { Router } from "express";
import {
	handleLogin,
	handleLogout,
	handleValidateSession,
} from "../controllers/admin.controller";
import { validateRequestBody } from "../middleware/validation";

export const adminRouter = Router();

adminRouter.post(
	"/admin/login",
	validateRequestBody(adminCredentials),
	handleLogin,
);

adminRouter.get("/admin/session/validate", handleValidateSession);

adminRouter.delete("/admin/logout", handleLogout);
