import { z } from "zod";
import Admin from "../../generated/api/hire_me/Admin.js";

export interface UserCredentials {
	email: Admin["email"];
	password: string;
}

export const userCredentials = z.object({
	email: z.string().email("Invalid email address."),
	password: z.string(),
});
