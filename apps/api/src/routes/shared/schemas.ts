import { z } from "zod";

export const roleIdParamSchema = z.object({
	role_id: z.coerce.number(),
});
