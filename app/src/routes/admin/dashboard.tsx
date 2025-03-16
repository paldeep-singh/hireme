import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { routes } from "shared/src/generated/routes/role";

const {
  GetRolePreviews: { method, path },
} = routes;

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    fetch(path, { method }).then((response) =>
      response.json().then((value) => console.log(value))
    );
  });

  return <div>Hello "/admin/dashboard"!</div>;
}
