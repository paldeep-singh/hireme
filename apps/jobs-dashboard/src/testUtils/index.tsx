import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRouter,
	defaultStringifySearch,
	RouterProvider,
} from "@tanstack/react-router";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";
import { routeTree } from "../routeTree.gen"; // Import your app's route tree

const queryClient = new QueryClient();

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	initialUrl: string;
	initialSearch?: {
		error?: string;
		redirect?: string;
	};
}

vi.mock("@tanstack/react-router-devtools");

export function renderRoute({
	initialUrl,
	initialSearch = {},
	...renderOptions
}: CustomRenderOptions) {
	const searchString = defaultStringifySearch(
		initialSearch as Record<string, string>,
	).toString();

	const fullUrl = searchString ? `${initialUrl}${searchString}` : initialUrl;

	const memoryHistory = createMemoryHistory({
		initialEntries: [fullUrl],
	});

	const router = createRouter({
		routeTree,
		history: memoryHistory,
	});

	const mockedNavigate = vi.fn();

	router.navigate = mockedNavigate;

	const returnValue = render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
		renderOptions,
	);

	return {
		...returnValue,
		router,
		history: memoryHistory,
		navigate: mockedNavigate,
	};
}
