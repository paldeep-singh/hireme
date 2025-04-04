import { useRouter } from "@tanstack/react-router";

export function Header() {
	const router = useRouter();

	const route = router.state.matches.at(-1);

	const pageTitle = route?.staticData.pageTitle;
	console.log(pageTitle);
	return (
		<header className="header">
			<h1>Jobs Dashboard</h1>
			<button>Logout</button>
		</header>
	);
}
