import {
	userCredentials,
	UserCredentials,
} from "@repo/api-types/types/api/UserCredentials";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useAppForm } from "../forms/useAppForm";
import { apiFetch } from "../utils/apiFetch";
import { validateSession } from "../utils/validateSession";

interface LoginSearchParams {
	error?: string;
	redirect?: string;
	notification?: string;
}

const loginSearchParams = z.object({
	error: z.string().optional(),
	redirect: z.string().optional(),
	notification: z.string().optional(),
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
				to: "/dashboard/roles",
			});
		}

		return;
	},
});

function Admin() {
	const {
		error: urlError,
		redirect: redirectUrl,
		notification,
	} = Route.useSearch();

	const router = useRouter();

	const loginUserMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			if (redirectUrl) {
				router.history.push(redirectUrl);
			} else {
				void router.navigate({
					to: "/dashboard/roles",
					from: "/login",
				});
			}
		},
		onError: () => {
			void router.navigate({
				replace: true,
				to: ".",
				search: {
					error: urlError,
					redirect: redirectUrl,
				},
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
		<div className="grid-center-screen">
			<form
				className="login-form flow"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<h2>Admin Login</h2>
				<form.AppForm>
					<form.NotficationBanner notification={notification} />
				</form.AppForm>
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
	);
}

async function loginUser(creds: UserCredentials) {
	return await apiFetch<"Login">({
		path: "/api/admin/login",
		method: "post",
		body: creds,
		params: null,
	});
}
