import { formatDistanceToNow, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Activity } from "@/types/dashboard";

interface ActivityFeedProps {
  activities: Activity[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <CardDescription className="text-xs">
          Latest updates across your projects
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-75">
          <div className="divide-y">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-4 py-3"
              >
                <Avatar className="mt-0.5 h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[10px] font-medium">
                    {getInitials(activity.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.project}</span>
                    <span>·</span>
                    <span>
                      {formatDistanceToNow(parseISO(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
