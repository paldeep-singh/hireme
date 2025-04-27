import { createFileRoute } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";

export const Route = createFileRoute("/dashboard/add-role/role")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<AddRoleProgressBar currentStep="role" />
		</>
	);
}
