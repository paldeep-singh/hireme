import {
	createFileRoute,
	Outlet,
	redirect,
	useChildMatches,
} from "@tanstack/react-router";
import { validateSession } from "../../utils/validateSession";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
	beforeLoad: async ({ location }) => {
		const sessionStatus = await validateSession();

		if (sessionStatus.valid) {
			return;
		}

		return redirect({
			to: "/login",
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

function AdminLayout() {
	const currentRoute = useChildMatches({
		select: (routes) => routes[routes.length - 1],
	});

	return (
		<div className="inline-grid grid-cols-1 grid-flow-row auto-rows-min ">
			<header className="flex min-w-max bg-pink-500 justify-between items-center p-4">
				<h1 className="text-2xl">{currentRoute.staticData.title}</h1>
				<button className="bg-blue-400 p-4 rounded-md border-2 border-red-400">
					Sign Out
				</button>
			</header>
			<Outlet />
		</div>
	);
}
