import {
	CompanyId,
	companyInitializer,
	CompanyInitializer,
} from "@repo/api-types/generated/api/hire_me/Company";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo } from "react";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { useAddRoleContext } from "../../../forms/contexts/AddRoleContext";
import { useAppForm } from "../../../forms/useAppForm";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/add-role/company")({
	component: RouteComponent,
});

function RouteComponent() {
	const { setCompanyId } = useAddRoleContext();

	const { data: companies } = useQuery({
		queryKey: ["companies"],
		queryFn: async () => {
			return await apiFetch<"GetCompanies">({
				path: "/api/companies",
				method: "get",
				params: null,
				body: null,
			});
		},
	});

	const router = useRouter();

	const handleNext = (id: CompanyId) => {
		setCompanyId(id);

		void router.navigate({
			to: "/dashboard/add-role/role",
		});
	};

	const addCompanyMutation = useMutation({
		mutationFn: addCompany,
		onSuccess: (data) => {
			if (!data?.id) {
				throw new Error("Query did not return id");
			}

			handleNext(data.id);
		},
	});

	const companyNames = useMemo(
		() => companies?.map(({ name }) => name) ?? [],
		[companies],
	);

	const form = useAppForm({
		defaultValues: {
			name: "",
			website: undefined,
			notes: undefined,
		} as CompanyInitializer,
		validators: {
			onChange: companyInitializer,
		},
		onSubmit: ({ value }) => {
			const companyId = companies?.find(({ name }) => value.name === name)?.id;

			if (!companyId) {
				addCompanyMutation.mutate(value);
				return;
			}

			handleNext(companyId);
		},
	});

	return (
		<>
			<AddRoleProgressBar currentStep="company" />

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
						<form.ErrorBanner error={addCompanyMutation.error?.message} />
					</form.AppForm>
					<form.AppField name="name">
						{(field) => (
							<field.ComboBox label="Company name" values={companyNames} />
						)}
					</form.AppField>

					{/* Conditionally render extra fields if it's a new company */}

					<form.Subscribe selector={(state) => state.values.name}>
						{(name) =>
							(name === "" || !companyNames.includes(name)) && (
								<>
									<form.AppField name="website">
										{(field) => (
											<field.TextField
												label="Company website"
												type="text"
												error={field.state.meta.errorMap.onChange?.[0].message}
											/>
										)}
									</form.AppField>

									<form.AppField name="notes">
										{(field) => <field.TextField label="Notes" type="area" />}
									</form.AppField>
								</>
							)
						}
					</form.Subscribe>
					<form.SubmitButton
						label="Next >"
						loading={addCompanyMutation.isPending}
					/>
				</form>
			</div>
		</>
	);
}

async function addCompany(company: CompanyInitializer) {
	return await apiFetch<"AddCompany">({
		path: "/api/company",
		method: "post",
		body: company,
		params: null,
	});
}
