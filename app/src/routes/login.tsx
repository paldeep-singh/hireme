import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { userCredentials, UserCredentials } from "shared/types/userCredentials";
import { z } from "zod";
import { useAppForm } from "../forms/useAppForm";
import { apiFetch } from "../utils/apiFetch";
import { validateSession } from "../utils/validateSession";

interface LoginSearchParams {
	error?: string;
	redirect?: string;
}

const loginSearchParams = z.object({
	error: z.string().optional(),
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	component: Admin,
	validateSearch: (search): LoginSearchParams => {
		const { success } = loginSearchParams.safeParse(search);

		if (success) {
			return search;
		}

		return {};
	},
	beforeLoad: async () => {
		const { valid } = await validateSession();

		if (valid) {
			return redirect({
				from: "/login",
				to: "/admin/dashboard",
			});
		}

		return;
	},
});

function Admin() {
	const { error: urlError, redirect: redirectUrl } = Route.useSearch();

	const navigate = useNavigate();

	const loginUserMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			void navigate({
				to: redirectUrl ?? "/admin/dashboard",
				from: "/login",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		} as UserCredentials,
		onSubmit: ({ value }) => loginUserMutation.mutate(value),
		validators: {
			onChange: userCredentials,
		},
	});

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-10 text-center">
			<div className="box-content border-2 border-gray-500 p-4">
				<h1 className="mb-4">Admin Login</h1>

				<div className="flex flex-col items-center justify-center gap-1 align-middle">
					<form
						className="flex flex-col items-center"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							void form.handleSubmit();
						}}
					>
						<div className="flex flex-col gap-2">
							<form.AppForm>
								<form.ErrorBanner error={urlError} />
							</form.AppForm>
							<form.AppForm>
								<form.ErrorBanner error={loginUserMutation.error?.message} />
							</form.AppForm>
						</div>
						<form.AppField name="email">
							{(field) => (
								<field.TextField
									label="Email"
									type="email"
									error={field.state.meta.errorMap.onChange?.[0].message}
								/>
							)}
						</form.AppField>
						<form.AppField name="password">
							{(field) => <field.TextField label="Password" type="password" />}
						</form.AppField>
						<form.SubmitButton
							label="Submit"
							loading={loginUserMutation.isPending}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}

async function loginUser(creds: UserCredentials) {
	return await apiFetch<"Login">({
		path: "/api/admin/login",
		method: "post",
		body: creds,
	});
}
