import { RequirementInitializer } from "@repo/api-types/generated/api/hire_me/Requirement";
import {
	RequirementInput,
	requirementInputSchema,
	requirementInputShape,
} from "@repo/api-types/validators/Requirement";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { Button } from "../../../components/Button";
import { useAddRoleContext } from "../../../forms/contexts/AddRoleContext";
import { useAppForm } from "../../../forms/useAppForm";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/add-role/requirements")({
	component: RouteComponent,
});

function RouteComponent() {
	const { roleId } = useAddRoleContext();
	const router = useRouter();

	if (!roleId) {
		throw new Error("role id not set");
	}

	const addRequirementsMutation = useMutation({
		mutationFn: addRequirements,
		onSuccess: () => {
			void router.navigate({
				to: `/dashboard/role/${roleId}`,
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			requirements: [] as RequirementInput[],
		},
		onSubmit: ({ value }) => {
			addRequirementsMutation.mutate(
				value.requirements.map((data) => ({
					role_id: roleId,
					...data,
				})),
			);
		},
		validators: {
			onSubmit: z.object({
				requirements: z
					.array(requirementInputSchema)
					.min(1, "Must have at least 1 requirement."),
			}),
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="requirements" />
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
						<form.ErrorBanner error={addRequirementsMutation.error?.message} />
					</form.AppForm>

					<form.Subscribe selector={(state) => [state.errorMap]}>
						{([errorMap]) =>
							errorMap.onSubmit?.requirements ? (
								<form.AppForm>
									<form.ErrorBanner
										error={errorMap.onSubmit.requirements[0].message}
									/>
								</form.AppForm>
							) : null
						}
					</form.Subscribe>

					{/* <form.AppForm>
						<form.ErrorBanner error={form.state.errorMap.onSubmit} />
					</form.AppForm> */}

					<form.AppField name="requirements" mode="array">
						{(field) => (
							<div className="flex-column">
								{field.state.value.map((_, i) => (
									<div className="flex-row" key={`requirement-${i}`}>
										<form.AppField
											name={`requirements[${i}].description`}
											validators={{
												onChange: requirementInputShape.description,
											}}
										>
											{(subField) => (
												<field.TextField
													label={`Requirement ${i + 1}`}
													type="area"
													error={
														subField.state.meta.errorMap.onChange?.[0].message
													}
												/>
											)}
										</form.AppField>

										<form.AppField
											name={`requirements[${i}].bonus`}
											validators={{
												onChange: requirementInputShape.bonus,
											}}
										>
											{(subField) => (
												<field.CheckBox
													label="Bonus?"
													error={
														subField.state.meta.errorMap.onChange?.[0].message
													}
												/>
											)}
										</form.AppField>
										<Button label="X" onClick={() => field.removeValue(i)} />
									</div>
								))}

								<Button
									label="Add Requirement +"
									onClick={() =>
										field.pushValue({
											description: "",
											bonus: false,
										})
									}
								/>
							</div>
						)}
					</form.AppField>
					<form.AppForm>
						<form.SubmitButton
							label="Submit"
							loading={addRequirementsMutation.isPending}
						/>
					</form.AppForm>
				</form>
			</div>
		</>
	);
}

async function addRequirements(requirements: RequirementInitializer[]) {
	return await apiFetch<"AddRequirements">({
		path: "/api/requirements",
		method: "post",
		body: requirements,
		params: null,
	});
}
