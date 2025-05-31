import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LinkButton } from "../../components/LinkButton";
import { RoleCard } from "../../components/RoleCard";
import { apiFetch } from "../../utils/apiFetch";

export const Route = createFileRoute("/(authed)/roles")({
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
			<div className="flex-space-between">
				<h1>Roles</h1>{" "}
				<LinkButton to="/add-role/company" label="Add role" variant="primary" />
			</div>
			{isLoading && <div>Loading...</div>}
			{isFetching && <div>Fetching...</div>}
			<div className="grid-auto-fill">
				{data?.map((role) => <RoleCard key={role.id} {...role} />)}
			</div>
		</div>
	);
}
