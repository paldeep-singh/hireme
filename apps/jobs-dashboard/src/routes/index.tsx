import { createFileRoute, redirect } from "@tanstack/react-router";
import { validateSession } from "../utils/validateSession";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const sessionStatus = await validateSession();

		if (sessionStatus.valid) {
			return redirect({
				to: "/dashboard",
				from: "/",
			});
		}

		return redirect({
			to: "/login",
			from: "/",
		});
	},
});
