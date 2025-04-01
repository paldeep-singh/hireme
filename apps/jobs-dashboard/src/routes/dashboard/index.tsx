import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RoleCard } from "../../components/RoleCard";
import { apiFetch } from "../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/")({
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
