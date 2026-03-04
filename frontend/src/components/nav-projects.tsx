import { useProjects } from "@/hooks/useProjects";
import { useAppSelector } from "@/hooks/redux";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "@tanstack/react-router";
import {
  IconChevronRight,
  IconFolderFilled,
  IconFolder,
} from "@tabler/icons-react";
import type { ProjectItem, ProjectRole } from "@/types/project";

const roleBadgeColor: Record<ProjectRole, string> = {
  PO: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  PM: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  DEVELOPER: "bg-green-500/15 text-green-600 dark:text-green-400",
};

export function NavProjects() {
  const { data: projects = [], isLoading } = useProjects();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMIN";

  /** Resolve the current user's role within a project */
  function getUserRole(project: ProjectItem): ProjectRole | null {
    if (!user) return null;
    const membership = project.members.find((m) => m.user._id === user.id);
    return membership?.role ?? null;
  }

  if (isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-xs text-muted-foreground">Loading…</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (projects.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard/projects">
                <IconFolder className="size-4" />
                <span className="text-xs text-muted-foreground">
                  No projects yet
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer select-none">
            <span>Projects</span>
            <IconChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenu>
            {projects.map((project) => {
              const role = getUserRole(project);
              return (
                <SidebarMenuItem key={project._id}>
                  <SidebarMenuButton asChild tooltip={project.name}>
                    <Link
                      to="/dashboard/projects/$projectId"
                      params={{ projectId: project._id }}
                      className="flex items-center gap-2"
                    >
                      <IconFolderFilled className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{project.name}</span>
                      {/* Show role badge — ADMIN sees "ADMIN", members see their project role */}
                      {isAdmin ? (
                        <Badge
                          variant="outline"
                          className="ml-auto shrink-0 px-1.5 py-0 text-[9px] font-semibold"
                        >
                          ADMIN
                        </Badge>
                      ) : role ? (
                        <Badge
                          className={`ml-auto shrink-0 border-0 px-1.5 py-0 text-[9px] font-semibold ${roleBadgeColor[role]}`}
                        >
                          {role}
                        </Badge>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

            {/* View all link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/dashboard/projects"
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  <IconFolder className="size-4" />
                  <span className="text-xs font-medium">View all projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
