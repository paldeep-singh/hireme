import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { apiFetch } from "../utils/apiFetch";
import { Button } from "./Button";

export function Header() {
	const navigate = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			void navigate({
				to: "/login",
				search: {
					notification: "You have been successfully logged out.",
				},
			});
		},
	});

	return (
		<header className="header">
			<Link to="/dashboard" className="header__title">
				Jobs Dashboard
			</Link>
			<Button label="Logout" onClick={() => logoutMutation.mutate()} />
		</header>
	);
}

async function logoutUser() {
	await apiFetch<"Logout">({
		path: "/api/admin/logout",
		method: "delete",
		body: null,
		params: null,
	});
}
