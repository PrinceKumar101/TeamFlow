import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  userName: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <Avatar className="h-11 w-11 ring-2 ring-primary/20 sm:h-12 sm:w-12">
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Daily Overview
          </p>
          <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">{today}</p>
        </div>
      </div>
    </div>
  );
}
