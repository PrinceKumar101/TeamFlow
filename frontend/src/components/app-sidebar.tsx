import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconLayoutKanban,
  IconLayoutList,
  IconSearch,
  IconSettings,
  IconTargetArrow,
  IconTestPipe,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import ThemSwitcherButton from "./themeSwitcher";
import { useAppSelector } from "@/hooks/redux";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Backlog",
      url: "/dashboard/backlog",
      icon: IconLayoutList,
    },
    {
      title: "Board",
      url: "/dashboard/tasks",
      icon: IconLayoutKanban,
    },
    {
      title: "Sprint Backlog",
      url: "/dashboard/sprintBacklog",
      icon: IconTargetArrow,
    },
    {
      title: "Testing",
      url: "/dashboard/testing",
      icon: IconTestPipe,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authUser = useAppSelector((s) => s.auth.user);
  const sidebarUser = {
    name: authUser?.name ?? "User",
    email: authUser?.email ?? "",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link to="/">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" className="size-7 object-center" />
                    <span className="text-base font-semibold">
                      {import.meta.env.VITE_APP_NAME}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>

              <ThemSwitcherButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
