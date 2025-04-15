import { userCredentials } from "@repo/api-types/types/api/UserCredentials";
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
	validateRequestBody(userCredentials),
	handleLogin,
);

adminRouter.get("/admin/session/validate", handleValidateSession);

adminRouter.delete("/admin/logout", handleLogout);
