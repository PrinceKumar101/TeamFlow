import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Task } from "@/types/dashboard";

interface TaskDistributionChartProps {
  tasks: Task[];
}

const statusColors: Record<string, string> = {
  "To Do": "var(--color-muted-foreground)",
  "In Progress": "#3b82f6",
  "In Review": "#8b5cf6",
  Done: "#10b981",
};

export function TaskDistributionChart({ tasks }: TaskDistributionChartProps) {
  const statusMap: Record<string, number> = {
    "To Do": 0,
    "In Progress": 0,
    "In Review": 0,
    Done: 0,
  };

  const statusLabelMap: Record<string, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    "in-review": "In Review",
    done: "Done",
  };

  tasks.forEach((task) => {
    const label = statusLabelMap[task.status];
    if (label) statusMap[label]++;
  });

  const data = Object.entries(statusMap)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Task Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Breakdown of tasks by status
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-50 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={statusColors[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
