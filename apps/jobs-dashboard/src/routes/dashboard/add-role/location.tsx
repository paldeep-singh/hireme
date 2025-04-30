import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/add-role/location")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Location</div>;
}
