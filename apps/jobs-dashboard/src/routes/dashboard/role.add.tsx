import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/role/add")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello!</div>;
}
