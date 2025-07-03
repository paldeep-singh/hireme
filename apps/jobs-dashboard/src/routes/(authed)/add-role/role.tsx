import { RoleInitializer } from "@repo/api-types/generated/api/hire_me/Role";
import { RoleInput, roleInputShape } from "@repo/api-types/validators/Role";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { useAddRoleContext } from "../../../forms/contexts/AddRoleContext";
import { useAppForm } from "../../../forms/useAppForm";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/(authed)/add-role/role")({
	component: RouteComponent,
});

function RouteComponent() {
	const { companyId, setRoleId } = useAddRoleContext();

	if (!companyId) {
		throw new Error("company id not set");
	}

	const router = useRouter();

	const addRoleMutation = useMutation({
		mutationFn: addRole,
		onSuccess: (data) => {
			if (!data?.id) {
				throw new Error("Query did not return id");
			}

			setRoleId(data.id);

			void router.navigate({
				to: "/add-role/location",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			title: "",
			ad_url: undefined,
			notes: undefined,
			type: "permanent",
			term: null,
		} as RoleInput,
		onSubmit: ({ value }) => {
			addRoleMutation.mutate({
				company_id: companyId,
				...value,
			});
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="role" />
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
						<form.ErrorBanner error={addRoleMutation.error?.message} />
					</form.AppForm>

					<form.AppField
						name="title"
						validators={{
							onChange: roleInputShape.title,
						}}
					>
						{(field) => (
							<field.TextField
								label="Title"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="ad_url"
						validators={{
							onChange: roleInputShape.ad_url,
						}}
					>
						{(field) => (
							<field.TextField
								label="Ad link"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="type"
						listeners={{
							onChange: ({ value }) => {
								if (value === "permanent") {
									form.setFieldValue("term", null);
								}
							},
						}}
						validators={{
							onChange: roleInputShape.type,
						}}
					>
						{(field) => (
							<field.Select
								label="Type"
								options={["permanent", "fixed_term"]}
							/>
						)}
					</form.AppField>

					<form.Subscribe>
						{({ values }) =>
							values.type === "fixed_term" && (
								<form.AppField
									name="term"
									validators={{
										onChange: roleInputShape.term,
									}}
								>
									{(field) => (
										<>
											<field.IntervalField
												label="Term"
												error={field.state.meta.errorMap.onChange?.[0].message}
											/>
										</>
									)}
								</form.AppField>
							)
						}
					</form.Subscribe>

					<form.AppField
						name="notes"
						validators={{
							onChange: roleInputShape.notes,
						}}
					>
						{(field) => <field.TextField label="Notes" type="area" />}
					</form.AppField>
					<form.AppForm>
						<form.SubmitButton
							label="Next >"
							loading={addRoleMutation.isPending}
						/>
					</form.AppForm>
				</form>
			</div>
		</>
	);
}

async function addRole({ company_id, ...role }: RoleInitializer) {
	return await apiFetch<"AddRole">({
		path: "/api/company/:company_id/role",
		method: "post",
		body: role,
		params: { company_id },
	});
}
