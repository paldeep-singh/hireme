import { useMutation } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { apiFetch } from "../utils/apiFetch";
import { Button } from "./Button";

export function Header() {
	const logoutMutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			return redirect({
				to: "/login",
			});
		},
	});

	return (
		<header className="header">
			<p className="header__title">Jobs Dashboard</p>
			<Button label="Logout" onClick={() => logoutMutation.mutate()} />
		</header>
	);
}

async function logoutUser() {
	await apiFetch<"Logout">({
		path: "/api/admin/logout",
		method: "delete",
		body: null,
	});
}
