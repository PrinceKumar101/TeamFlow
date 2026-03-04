import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/components/dashboard/notFound";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { queryClient } from "@/lib/queryClient";
import { getMe } from "@/api/auth.api";
import { authKeys } from "@/hooks/useAuth";
import store from "@/store/store";
import { setUser } from "@/store/slices/authSlice";
import type { User } from "@/types/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    try {
      const user = await queryClient.ensureQueryData({
        queryKey: authKeys.me,
        queryFn: async () => {
          const data = await getMe();
          return data.data as User;
        },
        staleTime: 5 * 60 * 1000,
      });
      // Sync to Redux so sidebar / role checks have access
      store.dispatch(setUser(user));
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,

  notFoundComponent: NotFound,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
