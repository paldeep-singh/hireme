import {
	RoleLocationInitializer,
	roleLocationInitializer,
} from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { useAddRoleContext } from "../../../forms/contexts/AddRoleContext";
import { useAppForm } from "../../../forms/useAppForm";
import { getFormOrFieldError } from "../../../forms/utils/errors";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/add-role/location")({
	component: RouteComponent,
});

function RouteComponent() {
	const { roleId } = useAddRoleContext();
	const router = useRouter();

	if (!roleId) {
		throw new Error("role id not set");
	}

	const addLocationMutation = useMutation({
		mutationFn: addLocation,
		onSuccess: () => {
			void router.navigate({
				to: "/dashboard/add-role/contract", // Assuming this is the next step
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			role_id: roleId,
			remote: false,
			hybrid: false,
			on_site: false,
			location: "",
			office_days: { max: null, min: null },
		} as RoleLocationInitializer,
		validators: {
			onChange: roleLocationInitializer,
		},
		onSubmit: ({ value }) => {
			addLocationMutation.mutate(value);
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="location" />
			<div className="role-form__container" data-width="narrow">
				<form
					className="role-form flow"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<form.AppForm>
						<form.ErrorBanner error={addLocationMutation.error?.message} />
					</form.AppForm>

					<form.AppField name="location">
						{(field) => (
							<field.TextField
								label="Location"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField name="remote">
						{(field) => (
							<field.CheckBox
								label="Remote"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField name="hybrid">
						{(field) => (
							<field.CheckBox
								label="Hybrid"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField name="on_site">
						{(field) => (
							<field.CheckBox
								label="On-site"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>
					{/* TODO: Office days */}

					<form.AppField
						name="office_days.min"
						validators={{
							onChange: ({ value, fieldApi }) => {
								if (!value) {
									return;
								}

								const max = fieldApi.form.getFieldValue("office_days.max");

								if (!max) {
									return;
								}

								if (value > max) {
									return "Min office days must be less than max office days.";
								}
							},
							onChangeListenTo: ["office_days.max"],
						}}
					>
						{(field) => {
							return (
								<field.NumberField
									label="Minimum office days"
									error={getFormOrFieldError(
										field.state.meta.errorMap.onChange,
									)}
									min={0}
									max={7}
								/>
							);
						}}
					</form.AppField>

					<form.AppForm>
						<form.AppField
							name="office_days.max"
							validators={{
								onChange: ({ value, fieldApi }) => {
									if (!value) {
										return;
									}

									const min = fieldApi.form.getFieldValue("office_days.min");

									if (!min) {
										return;
									}

									if (value < min) {
										return "Max office days must be greater than min office days.";
									}
								},
								onChangeListenTo: ["office_days.min"],
							}}
						>
							{(field) => (
								<field.NumberField
									label="Maximum office days"
									error={getFormOrFieldError(
										field.state.meta.errorMap.onChange,
									)}
									min={0}
									max={7}
								/>
							)}
						</form.AppField>
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

async function addLocation(location: RoleLocationInitializer) {
	return await apiFetch<"AddRoleLocation">({
		path: "/api/role-location",
		method: "post",
		body: location,
		params: null,
	});
}
