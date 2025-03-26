import { ApiRequests } from "shared/generated/routes/fetchTypes.js";

export async function apiFetch<K extends keyof ApiRequests>({
	path,
	body,
	method,
}: Omit<ApiRequests[K], "responseBody">) {
	const response = await fetch(path, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		headers: {
			...(typeof body === "object" && {
				"Content-Type": "application/json",
			}),
		},
	});

	if (!response.ok) {
		await parseErrorResponse(response);
	}

	const contentType = response.headers.get("content-type");

	if (contentType?.includes("application/json")) {
		return await parseSuccessResponse<K>(response);
	}

	return;
}

async function parseSuccessResponse<K extends keyof ApiRequests>(
	response: Response,
) {
	try {
		const data = (await response.json()) as ApiRequests[K]["responseBody"];

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
