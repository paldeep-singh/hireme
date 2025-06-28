import { z } from "zod";

export const roleIdParamSchema = z.object({
	roleId: z.coerce.number(),
});
