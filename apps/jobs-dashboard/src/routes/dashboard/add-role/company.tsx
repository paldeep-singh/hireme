import {
	companyInitializer,
	CompanyInitializer,
} from "@repo/api-types/generated/api/hire_me/Company";
import { useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AddRoleProgressBar } from "../../../components/AddRoleProgressBar";
import { useAppForm } from "../../../forms/useAppForm";
import { apiFetch } from "../../../utils/apiFetch";

export const Route = createFileRoute("/dashboard/add-role/company")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isNewCompany, setIsNewCompany] = useState(true);

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

	const addCompanyMutation = useMutation({
		mutationFn: addCompany,
		onSuccess: (data) => {
			void router.navigate({
				to: "/dashboard/add-role/role",
				params: {
					companyId: data?.id,
				},
			});
		},
		onError: (error) => {
			console.log(error);
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
			console.log("onSubmit", isNewCompany);
			// if (isNewCompany) {
			addCompanyMutation.mutate(value);
			// }
		},
	});

	const name = useStore(form.store, (state) => state.values.name);

	useEffect(() => {
		setIsNewCompany(companyNames && !companyNames.includes(name));
	}, [companyNames, name]);

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
					<form.AppField name="name">
						{(field) => (
							<field.ComboBox label="Company name" values={companyNames} />
						)}
					</form.AppField>

					{/* Conditionally render extra fields if it's a new company */}

					{isNewCompany && (
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
					)}

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
