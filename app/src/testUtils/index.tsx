import { render, RenderOptions } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { vi } from "vitest";
import { routeTree } from "../routeTree.gen"; // Import your app's route tree

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialUrl: string;
  initialSearch?: {
    error?: string;
    redirect?: string;
  };
}

vi.mock("@tanstack/router-devtools");

export function renderRoute({
  initialUrl,
  initialSearch = {},
  ...renderOptions
}: CustomRenderOptions) {
  const searchString = new URLSearchParams(
    initialSearch as Record<string, string>,
  ).toString();

  const fullUrl = searchString ? `${initialUrl}?${searchString}` : initialUrl;

  const memoryHistory = createMemoryHistory({
    initialEntries: [fullUrl],
  });

  const router = createRouter({
    routeTree,
    history: memoryHistory,
  });

  const mockedNavigate = vi.fn();

  router.navigate = mockedNavigate;

  const returnValue = render(<RouterProvider router={router} />, renderOptions);

  return {
    ...returnValue,
    router,
    history: memoryHistory,
    navigate: mockedNavigate,
  };
}
