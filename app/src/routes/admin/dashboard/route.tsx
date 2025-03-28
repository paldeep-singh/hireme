import { createFileRoute, redirect } from "@tanstack/react-router";
import { validateSession } from "../../../utils/validateSession";

export const Route = createFileRoute("/admin/dashboard")({
	beforeLoad: async ({ location }) => {
		const sessionStatus = await validateSession();

		if (sessionStatus.valid) {
			return;
		}

		return redirect({
			to: "/admin/login",
			search: {
				// Use the current location to power a redirect after login
				// (Do not use `router.state.resolvedLocation` as it can
				// potentially lag behind the actual current location)
				redirect: location.href,
				error: sessionStatus.error,
			},
		});
	},
});
