import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { RoleCard } from "../../../components/RoleCard";
import { apiFetch } from "../../../utils/apiFetch";
import { validateSession } from "../../../utils/validateSession";

export const Route = createFileRoute("/admin/dashboard/")({
	component: RouteComponent,
	beforeLoad: async ({ location }) => {
		const sessionStatus = await validateSession();

		if (sessionStatus.valid) {
			return;
		}

		console.log(sessionStatus.error);
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

function RouteComponent() {
	const { data, isFetching, isLoading } = useQuery({
		queryKey: ["companies"],
		queryFn: async () => {
			return await apiFetch<"GetRolePreviews">({
				path: "/api/roles/previews",
				method: "get",
				body: null,
			});
		},
	});

	return (
		<div className="flex flex-col gap-4 p-8">
			<h1 className="text-2xl font-bold">Roles</h1>
			{isLoading && <div>Loading...</div>}
			{isFetching && <div>Fetching...</div>}
			<div className="flex flex-row flex-wrap gap-4">
				{data?.map((role) => <RoleCard key={role.id} {...role} />)}
			</div>
		</div>
	);
}
