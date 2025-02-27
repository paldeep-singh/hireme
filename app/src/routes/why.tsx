import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/why")({
  component: About,
});

function About() {
  return <div className="p-2">For these reasons</div>;
}
