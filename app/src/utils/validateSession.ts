import { apiFetch } from "./apiFetch";
import { getSessionCookie } from "./sessionCookies";

interface ValidSession {
	valid: true;
}

interface InvalidSession {
	valid: false;
	error: string;
}

export async function validateSession(): Promise<
	ValidSession | InvalidSession
> {
	const session = getSessionCookie();

	if (!session) {
		return {
			valid: false,
			error: "No session found, please login again.",
		};
	}

	try {
		await apiFetch<"ValidateSession">({
			method: "get",
			path: "/api/admin/session/validate",
			body: null,
		});

		return {
			valid: true,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				valid: false,
				error: error.message,
			};
		}

		return {
			valid: false,
			error: "An unknown error occurred, please try again.",
		};
	}
}
