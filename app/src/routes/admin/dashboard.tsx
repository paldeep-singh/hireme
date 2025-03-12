import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    fetch("/api/roles/previews").then((response) =>
      response.json().then((value) => console.log(value))
    );
  });

  return <div>Hello "/admin/dashboard"!</div>;
}
