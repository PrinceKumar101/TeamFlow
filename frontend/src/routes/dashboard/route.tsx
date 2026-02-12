import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row gap-1  min-w-screen w-screen">
      <aside>
        <SidebarProvider className="w-1/5">
          <AppSidebar />
        </SidebarProvider>
      </aside>
      <main className="w-fit">
        <Outlet />
      </main>
    </div>
  );
}
