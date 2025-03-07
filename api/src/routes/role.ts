import { Router } from "express";
import { validateRequestBody } from "../middleware/validation";
import { roleInitializer } from "../../generatedTypes/hire_me/Role";
import { handleAddRole } from "../controllers/role";

export const roleRouter = Router();

roleRouter.post("/role", validateRequestBody(roleInitializer), handleAddRole);
