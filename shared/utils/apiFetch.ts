import Session, { SessionId } from "generated/db/hire_me/Session.js";

interface ValidSession {
	valid: true;
}

interface InvalidSession {
	valid: false;
	error: string;
}

interface LoginRequest {
	method: "post";
	path: "/api/admin/login";
	response: Pick<Session, "id">;
	body: {
		email: string;
		password: string;
	};
}

interface ValidateSessionRequest {
	method: "get";
	path: "/api/admin/session/validate";
	response: ValidSession | InvalidSession;
	body: {
		id: SessionId;
	};
}

interface ApiRequests {
	LoginRequest: LoginRequest;
	ValidateSessionRequest: ValidateSessionRequest;
}

export async function apiFetch<K extends keyof ApiRequests>({
	path,
	body,
	method,
}: Omit<ApiRequests[K], "response">) {
	const response = await fetch(`http://localhost:3001${path}`, {
		method,
		body: JSON.stringify(body),
		headers: {
			...(typeof body === "object" && {
				"Content-Type": "application/json",
			}),
		},
	});

	if (!response.ok) {
		await parseErrorResponse(response);
	}

	return await parseSuccessResponse<K>(response);
}

async function parseSuccessResponse<K extends keyof ApiRequests>(
	response: Response,
) {
	try {
		const data = (await response.json()) as ApiRequests[K]["response"];

		return data;
	} catch {
		throw new Error("Could not parse response data.");
	}
}

async function parseErrorResponse(response: Response) {
	let error: string;
	try {
		error = ((await response.json()) as { error: string }).error;
	} catch {
		throw new Error("An unknown error occurred, error could not be parsed.");
	}

	throw new Error(error);
}
