import {
	roleInitializer,
	RoleInitializer,
} from "@repo/api-types/generated/api/hire_me/Role";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { useAddRoleContext } from "../../../forms/contexts/AddRoleContext";
import { useAppForm } from "../../../forms/useAppForm";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/add-role/role")({
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
				to: "/dashboard/add-role/location",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			company_id: companyId,
			title: "",
			ad_url: undefined,
			notes: undefined,
		} as Omit<RoleInitializer, "date_added">,
		validators: {
			onChange: roleInitializer,
		},
		onSubmit: ({ value }) => {
			addRoleMutation.mutate(value);
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="role" />
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
						<form.ErrorBanner error={addRoleMutation.error?.message} />
					</form.AppForm>

					<form.AppField name="title">
						{(field) => (
							<field.TextField
								label="Title"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField name="ad_url">
						{(field) => (
							<field.TextField
								label="Ad link"
								type="text"
								error={field.state.meta.errorMap.onChange?.[0].message}
							/>
						)}
					</form.AppField>

					<form.AppField name="notes">
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

async function addRole(role: RoleInitializer) {
	return await apiFetch<"AddRole">({
		path: "/api/role",
		method: "post",
		body: role,
		params: null,
	});
}
