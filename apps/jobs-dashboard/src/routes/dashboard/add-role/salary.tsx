import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/add-role/salary")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>{'Hello "/dashboard/add-role/contract"!'}</div>;
}
