import { z } from "zod";
import {
	RoleLocationId,
	RoleLocationInitializer,
} from "../generated/api/hire_me/RoleLocation.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { roleId } from "./Role.js";

export const roleLocationId = z
	.number()
	.transform((value) => value as RoleLocationId);

export type RoleLocationInput = OmitStrict<RoleLocationInitializer, "role_id">;

export const roleLocationInputShape: ZodShape<RoleLocationInput> = {
	location: z.string().min(1),
	on_site: z.boolean(),
	hybrid: z.boolean(),
	remote: z.boolean(),
	office_days: z
		.object({
			min: z.number().nullable(),
			max: z.number().nullable(),
		})
		.nullable()
		.optional(),
};

export const roleLocationInitializerShape: ZodShape<RoleLocationInitializer> = {
	...roleLocationInputShape,
	role_id: roleId,
};

export const roleLocationInputSchema = z.object(roleLocationInputShape);

export const roleLocationInitializerSchema = z.object(
	roleLocationInitializerShape,
);
