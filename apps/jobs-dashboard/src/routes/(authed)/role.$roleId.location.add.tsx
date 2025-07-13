import { RoleId } from "@repo/api-types/generated/api/hire_me/Role";
import { RoleLocationInitializer } from "@repo/api-types/generated/api/hire_me/RoleLocation";
import {
	RoleLocationInput,
	roleLocationInputShape,
} from "@repo/api-types/validators/RoleLocation";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../components/AddRoleProgressBar";
import { useAppForm } from "../../forms/useAppForm";
import { apiFetch } from "../../utils/apiFetch";

export const Route = createFileRoute("/(authed)/role/$roleId/location/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const { roleId } = Route.useParams();

	const addLocationMutation = useMutation({
		mutationFn: addLocation,
		onSuccess: () => {
			void router.navigate({
				to: `/role/${roleId}`, // Assuming this is the next step
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			remote: false,
			hybrid: false,
			on_site: false,
			location: "",
			office_days: { max: null, min: null },
		} as RoleLocationInput,
		onSubmit: ({ value }) => {
			addLocationMutation.mutate({
				role_id: Number(roleId) as RoleId,
				...value,
			});
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="location" />
			<div className="role-form__container" data-width="narrow">
				<form
					className="form flow"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<form.AppForm>
						<form.ErrorBanner error={addLocationMutation.error?.message} />
					</form.AppForm>

					<form.AppField
						name="location"
						validators={{
							onChange: roleLocationInputShape.location,
						}}
					>
						{(field) => (
							<field.TextField
								label="Location"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="remote"
						validators={{
							onChange: roleLocationInputShape.remote,
						}}
					>
						{(field) => (
							<field.CheckBox
								label="Remote"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="hybrid"
						validators={{
							onChange: roleLocationInputShape.hybrid,
						}}
					>
						{(field) => (
							<field.CheckBox
								label="Hybrid"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="on_site"
						validators={{
							onChange: roleLocationInputShape.on_site,
						}}
					>
						{(field) => (
							<field.CheckBox
								label="On-site"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="office_days"
						validators={{
							onChange: roleLocationInputShape.office_days,
						}}
					>
						{(field) => (
							<field.NumRangeField
								label="Office days"
								unit="days"
								min={0}
								max={5}
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppForm>
						<form.SubmitButton
							label="Next >"
							loading={addLocationMutation.isPending}
						/>
					</form.AppForm>
				</form>
			</div>
		</>
	);
}

async function addLocation({ role_id, ...location }: RoleLocationInitializer) {
	return await apiFetch<"AddRoleLocation">({
		path: "/api/role/:role_id/location",
		method: "post",
		body: location,
		params: { role_id },
	});
}
