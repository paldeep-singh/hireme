import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { apiFetch } from "../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/role/$roleId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { roleId } = Route.useParams();
	const {
		data: roleDetails,
		isFetching,
		isLoading,
	} = useQuery({
		queryKey: ["role-details"],
		queryFn: async () => {
			return await apiFetch<"GetRoleDetails">({
				path: "/api/role/:id",
				method: "get",
				params: {
					id: Number(roleId),
				},
				body: null,
			});
		},
	});

	if (!roleDetails) return null;

	return (
		<div className="wrapper flow">
			<h1>{roleDetails.title}</h1>
			<p>
				<strong>Added:</strong>{" "}
				{new Date(roleDetails.date_added).toLocaleDateString()}
			</p>
			<p>
				<strong>Ad URL:</strong>{" "}
				<a href={roleDetails.ad_url} target="_blank" rel="noopener noreferrer">
					{roleDetails.ad_url}
				</a>
			</p>
			<p>
				<strong>Notes:</strong> {roleDetails.notes}
			</p>

			<h2>Company</h2>
			<p>
				<strong>Name:</strong> {roleDetails.company.name}
			</p>
			<p>
				<strong>Website:</strong>{" "}
				<a
					href={roleDetails.company.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					{roleDetails.company.website}
				</a>
			</p>
			<p>
				<strong>Notes:</strong> {roleDetails.company.notes}
			</p>

			{roleDetails.application && (
				<>
					<h2>Application</h2>
					<p>
						<strong>Date Submitted:</strong>{" "}
						{new Date(
							roleDetails.application.date_submitted,
						).toLocaleDateString()}
					</p>
					<p>
						<strong>Cover Letter:</strong>{" "}
						{roleDetails.application.cover_letter}
					</p>
				</>
			)}

			{roleDetails.location && (
				<>
					<h2>Location</h2>
					<p>
						<strong>Location:</strong> {roleDetails.location.location}
					</p>
					<p>
						<strong>Remote:</strong>{" "}
						{roleDetails.location.remote ? "Yes" : "No"}
					</p>
					<p>
						<strong>On Site:</strong>{" "}
						{roleDetails.location.on_site ? "Yes" : "No"}
					</p>
					<p>
						<strong>Hybrid:</strong>{" "}
						{roleDetails.location.hybrid ? "Yes" : "No"}
					</p>
					<p>
						<strong>Office Days:</strong> {roleDetails.location.office_days.min}{" "}
						- {roleDetails.location.office_days.max}
					</p>
				</>
			)}

			{roleDetails.requirements.length > 0 && (
				<>
					<h2>Requirements</h2>
					<ul>
						{roleDetails.requirements.map((req) => (
							<li key={req.id}>{req.description}</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
