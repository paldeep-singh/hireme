import { CompanyInitializer } from "@repo/api-types/generated/api/hire_me/Company";
import { createFileRoute } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { useAppForm } from "../../../forms/useAppForm";

export const Route = createFileRoute("/dashboard/add-role/company")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			name: "",
		} as CompanyInitializer,
		// onSubmit: ({ value }) => loginUserMutation.mutate(value),
		// validators: {
		// 	onChange: userCredentials,
		// },
	});

	return (
		<>
			<AddRoleProgressBar currentStep="company" />

			<div className="role-form__container" data-width="narrow">
				<form className="role-form">
					<form.AppForm>
						<form.AppField name="name">
							{(field) => (
								<field.TextField
									label="Company name"
									type="text"
									// error={field.state.meta.errorMap.onChange?.[0].message}
								/>
							)}
						</form.AppField>

						<form.AppField name="website">
							{(field) => (
								<field.TextField
									label="Company website"
									type="text"
									// error={field.state.meta.errorMap.onChange?.[0].message}
								/>
							)}
						</form.AppField>

						<form.AppField name="notes">
							{(field) => (
								<field.TextField
									label="Notes"
									type="area"
									// error={field.state.meta.errorMap.onChange?.[0].message}
								/>
							)}
						</form.AppField>
					</form.AppForm>
				</form>
			</div>
		</>
	);
}
