import { SalaryInitializer } from "@repo/api-types/generated/api/hire_me/Salary";
import {
	SalaryInput,
	salaryInputShape,
} from "@repo/api-types/validators/Salary";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { Button } from "../../../components/Button";
import { useAddRoleContext } from "../../../forms/contexts/AddRoleContext";
import { useAppForm } from "../../../forms/useAppForm";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/(authed)/add-role/salary")({
	component: RouteComponent,
});

function RouteComponent() {
	const { roleId } = useAddRoleContext();
	const router = useRouter();

	if (!roleId) {
		throw new Error("role id not set");
	}

	const addSalaryMutation = useMutation({
		mutationFn: addSalary,
		onSuccess: () => {
			void router.navigate({
				to: "/add-role/requirements",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			salary_currency: "",
			salary_includes_super: false,
			salary_period: "year",
			salary_range: {
				min: null,
				max: null,
			},
		} as SalaryInput,
		onSubmit: ({ value }) => {
			addSalaryMutation.mutate({
				role_id: roleId,
				...value,
			});
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="salary" />

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
						<form.ErrorBanner error={addSalaryMutation.error?.message} />
					</form.AppForm>

					<form.AppField
						name="salary_range"
						validators={{
							onChange: salaryInputShape.salary_range,
						}}
					>
						{(field) => (
							<field.NumRangeField
								label="Salary"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="salary_currency"
						validators={{
							onChange: salaryInputShape.salary_currency,
						}}
					>
						{(field) => (
							<field.TextField
								label="Currency"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="salary_includes_super"
						validators={{
							onChange: salaryInputShape.salary_includes_super,
						}}
					>
						{(field) => (
							<field.CheckBox
								label="Includes super?"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField name="salary_period">
						{(field) => (
							<field.Select
								label="Period"
								options={["year", "month", "week", "day"]}
							/>
						)}
					</form.AppField>

					<form.AppForm>
						<form.SubmitButton
							label="Next >"
							loading={addSalaryMutation.isPending}
						/>
					</form.AppForm>

					<Button
						label="Skip"
						onClick={() =>
							void router.navigate({ to: "/add-role/requirements" })
						}
					/>
				</form>
			</div>
		</>
	);
}

async function addSalary({ role_id, ...salary }: SalaryInitializer) {
	return await apiFetch<"AddSalary">({
		path: "/api/role/:role_id/salary",
		method: "post",
		body: salary,
		params: { role_id },
	});
}
