import { z } from "zod";
import { AdminCredentials } from "../types/api/AdminCredentials.js";

export const adminCredentials = z.object({
	email: z.string().email("Invalid email address."),
	password: z.string(),
}) satisfies z.ZodType<AdminCredentials>;
