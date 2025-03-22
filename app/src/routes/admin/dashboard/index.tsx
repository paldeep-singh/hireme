import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { validateSession } from "../../../utils/validateSession";

export const Route = createFileRoute("/admin/dashboard/")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const sessionStatus = await validateSession();

    if (sessionStatus.valid) {
      return;
    }

    console.log(sessionStatus.error);
    throw redirect({
      to: "/admin/login",
      search: {
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        redirect: location.href,
        error: sessionStatus.error,
      },
    });
  },
});

function RouteComponent() {
  useEffect(() => {
    fetch("/api/roles/previews").then((response) =>
      response.json().then((value) => console.log(value)),
    );
  });

  return <div>Hello "/admin/dashboard"!</div>;
}
