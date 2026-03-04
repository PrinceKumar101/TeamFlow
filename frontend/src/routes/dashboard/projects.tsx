import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsLayout,
});

/** Thin layout — just renders the active child route */
function ProjectsLayout() {
  return <Outlet />;
}
