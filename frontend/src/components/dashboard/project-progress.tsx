import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ProjectSummary } from "@/types/dashboard";

interface ProjectProgressProps {
  projects: ProjectSummary[];
}

export function ProjectProgress({ projects }: ProjectProgressProps) {
  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Projects</CardTitle>
        <CardDescription className="text-xs">
          Progress across your active projects
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="divide-y">
            {projects.map((project) => {
              const percentage =
                project.totalTasks > 0
                  ? Math.round(
                      (project.completedTasks / project.totalTasks) * 100
                    )
                  : 0;
              return (
                <div
                  key={project.id}
                  className="space-y-2.5 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium">
                        {project.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Progress value={percentage} className="h-1.5" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {project.completedTasks} / {project.totalTasks} tasks
                      </span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No projects yet
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
