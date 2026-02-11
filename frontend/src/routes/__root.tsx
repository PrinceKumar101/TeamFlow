import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <main className="min-h-screen">
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
