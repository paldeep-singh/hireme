import {
	userCredentials,
	UserCredentials,
} from "@repo/shared/types/userCredentials";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
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
				to: "/dashboard",
			});
		}

		return;
	},
});

function Admin() {
	const { error: urlError, redirect: redirectUrl } = Route.useSearch();

	const router = useRouter();

	const loginUserMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			if (redirectUrl) {
				router.history.push(redirectUrl);
			} else {
				void router.navigate({
					to: "/dashboard",
					from: "/login",
				});
			}
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
