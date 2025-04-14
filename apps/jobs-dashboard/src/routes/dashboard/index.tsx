import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	beforeLoad: () => {
		return redirect({
			to: "/dashboard/roles",
		});
	},
});
