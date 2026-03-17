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
        <Card
          key={item.key}
          className="group relative gap-0 overflow-hidden border-border/70 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
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
              <div
                className={`rounded-xl p-2.5 shadow-inner transition-transform group-hover:scale-105 ${item.bgColor}`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
