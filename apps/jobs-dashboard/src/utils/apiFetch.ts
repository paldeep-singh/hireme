import { ApiRequests } from "@repo/api-fetch/generated/routes/fetchTypes";

export async function apiFetch<K extends keyof ApiRequests>({
	path: basePath,
	body,
	method,
	params,
}: Omit<ApiRequests[K], "responseBody">) {
	const path = buildPath({ path: basePath, params });

	const response = await fetch(path, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		headers: {
			...(typeof body === "object" && {
				"Content-Type": "application/json",
			}),
		},
		credentials: "include",
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

function buildPath<K extends keyof ApiRequests>({
	path,
	params,
}: Pick<ApiRequests[K], "path" | "params">): string {
	if (!params) {
		return `${import.meta.env.VITE_API_URL}${path}`;
	}

	return `${import.meta.env.VITE_API_URL}${path.replace(
		/:([^/]+)/g,
		(_, key: string) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
			const value = (params as Record<string, any>)[key];
			if (value === undefined) {
				throw new Error(`Missing value for parameter: ${key}`);
			}
			return encodeURIComponent(String(value));
		},
	)}`;
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
