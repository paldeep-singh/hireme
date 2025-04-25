import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RoleCard } from "../../components/RoleCard";
import { apiFetch } from "../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/roles")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isFetching, isLoading } = useQuery({
		queryKey: ["companies"],
		queryFn: async () => {
			return await apiFetch<"GetRolePreviews">({
				path: "/api/roles/previews",
				method: "get",
				body: null,
				params: null,
			});
		},
	});

	return (
		<div className="wrapper flow">
			<h1>Roles</h1>
			{isLoading && <div>Loading...</div>}
			{isFetching && <div>Fetching...</div>}
			<div className="grid-auto-fill">
				{data?.map((role) => <RoleCard key={role.id} {...role} />)}
			</div>
		</div>
	);
}
