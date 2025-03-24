import Admin from "generated/db/hire_me/Admin.js";
import { z } from "zod";

export interface UserCredentials {
	email: Admin["email"];
	password: string;
}

export const userCredentials = z.object({
	email: z.string().email("Invalid email address."),
	password: z.string(),
});
