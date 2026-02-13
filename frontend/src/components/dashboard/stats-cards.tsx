import {
  IconChecklist,
  IconLoader,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types/dashboard";

interface StatsCardsProps {
  stats: DashboardStats;
}

const statItems = [
  {
    key: "totalTasks" as const,
    label: "Total Tasks",
    icon: IconChecklist,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: IconLoader,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: IconCircleCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    key: "overdue" as const,
    label: "Overdue",
    icon: IconAlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {statItems.map((item) => (
        <Card key={item.key} className="gap-0 py-4">
          <CardContent className="px-4 pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {item.label}
                </p>
                <p className="text-xl font-bold tracking-tight sm:text-2xl">
                  {stats[item.key]}
                </p>
              </div>
              <div className={`rounded-lg p-2 ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
