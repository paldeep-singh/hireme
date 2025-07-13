import { RoleId } from "@repo/api-types/generated/api/hire_me/Role";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Button } from "../../components/Button";
import { LinkButton } from "../../components/LinkButton";
import { apiFetch } from "../../utils/apiFetch";

export const Route = createFileRoute("/(authed)/role/$roleId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { roleId } = Route.useParams();
	const { data: roleDetails } = useQuery({
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
		<>
			<div className="background-light">
				<div className="wrapper" data-width="narrow">
					<div className="flow background-light">
						<h1>{roleDetails.title}</h1>
						<p>
							<strong>Added:</strong>{" "}
							{new Date(roleDetails.date_added).toLocaleDateString()}
						</p>
						{roleDetails.ad_url && (
							<p>
								<strong>Ad URL:</strong>{" "}
								<a
									href={roleDetails.ad_url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{roleDetails.ad_url}
								</a>
							</p>
						)}
						<p>
							<strong>Notes:</strong> {roleDetails.notes}
						</p>

						<h2>Company</h2>
						<p>
							<strong>Name:</strong> {roleDetails.company.name}
						</p>
						{roleDetails.company.website && (
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
						)}
						<p>
							<strong>Notes:</strong> {roleDetails.company.notes}
						</p>

						<h2>Location</h2>
						{roleDetails.location ? (
							<>
								<p>
									<strong>Location:</strong> {roleDetails.location.location}
								</p>
								<div className="flex-row">
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
									{roleDetails.location.office_days && (
										<p>
											<strong>Office Days:</strong>{" "}
											{roleDetails.location.office_days.min} -{" "}
											{roleDetails.location.office_days.max}
										</p>
									)}
								</div>
							</>
						) : (
							<LinkButton
								label="Add location"
								to="/role/$roleId/location/add"
								params={{ roleId }}
							/>
						)}

						<h2>Requirements</h2>
						{roleDetails.requirements?.length ? (
							<>
								<ul>
									{roleDetails.requirements.map((req) => (
										<li key={req.id}>
											{req.description}{" "}
											{req.bonus && <strong>{"(Bonus)"}</strong>}
										</li>
									))}
								</ul>
							</>
						) : (
							<LinkButton
								label="Add requirements"
								to="/role/$roleId/requirements/add"
								params={{ roleId }}
							/>
						)}

						{roleDetails.application && (
							<>
								<h2>Application</h2>

								{roleDetails.application.date_submitted && (
									<p>
										<strong>Date Submitted:</strong>{" "}
										{new Date(
											roleDetails.application.date_submitted,
										).toLocaleDateString()}
									</p>
								)}
								<p>
									<strong>Cover Letter:</strong>{" "}
									{roleDetails.application.cover_letter}
								</p>
							</>
						)}

						<DeleteRoleButton roleId={Number(roleId) as RoleId} />
					</div>
				</div>
			</div>
			<Outlet />
		</>
	);
}

function DeleteRoleButton({ roleId }: { roleId: RoleId }) {
	const router = useRouter();

	const deleteRoleMutation = useMutation({
		mutationFn: deleteRole,
		onSuccess: () => {
			void router.navigate({ to: "/roles" });
		},
	});

	const handleDelete = () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this role?",
		);
		if (confirmed) {
			deleteRoleMutation.mutate(roleId);
		}
	};

	return (
		<Button
			label="Delete role"
			variant="secondary"
			onClick={handleDelete}
			loading={deleteRoleMutation.isPending}
		/>
	);
}

async function deleteRole(roleId: RoleId) {
	await apiFetch<"DeleteRole">({
		path: "/api/role/:role_id",
		method: "delete",
		params: { role_id: roleId },
		body: null,
	});
}
