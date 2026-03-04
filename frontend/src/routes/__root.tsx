import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuthInit } from "@/hooks/useAuth";

const RootLayout = () => {
  // Restore user session from cookie on every app load
  const { isLoading } = useAuthInit();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
