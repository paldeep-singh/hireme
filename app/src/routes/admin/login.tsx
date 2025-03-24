import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Login, LoginResponse } from "shared/generated/routes/admin";
import { userCredentials, UserCredentials } from "shared/types/userCredentials";
import { z } from "zod";
import { useAppForm } from "../../forms/useAppForm";
import { storeSessionCookie } from "../../utils/sessionCookies";

interface LoginSearchParams {
	error?: string;
	redirect?: string;
}

const loginSearchParams = z.object({
	error: z.string().optional(),
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/admin/login")({
	component: Admin,
	validateSearch: (search): LoginSearchParams => {
		const { success } = loginSearchParams.safeParse(search);

		if (success) {
			return search;
		}

		return {};
	},
});

function Admin() {
	const { error: urlError, redirect: redirectUrl } = Route.useSearch();

	const navigate = useNavigate();

	const loginUserMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			storeSessionCookie(data);
			void navigate({
				to: redirectUrl ?? "/admin/dashboard",
				from: "/admin/login",
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
				<h1>Admin Login</h1>
				<div className="flex flex-col items-center justify-center gap-1 align-middle">
					<form
						className="flex flex-col items-center"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							void form.handleSubmit();
						}}
					>
						<form.AppForm>
							<form.ErrorBanner error={urlError} />
						</form.AppForm>
						<form.AppForm>
							<form.ErrorBanner error={loginUserMutation.error?.message} />
						</form.AppForm>
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
	const { method, path } = Login;

	const response = await fetch(path, {
		method,
		body: JSON.stringify(creds),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		const data = (await response.json()) as LoginResponse;
		return data;
	}
	const { error } = (await response.json()) as { error: string };

	throw new Error(error);
}
