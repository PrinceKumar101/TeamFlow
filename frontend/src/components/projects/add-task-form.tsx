import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Plus, UserCircle, Check, Search, X } from "lucide-react";
import type { UserInfo } from "@/types/project";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  dueDate: z.string().optional(),
});

interface Props {
  projectId: string;
  members: UserInfo[];
}

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function AddTaskForm({ projectId, members }: Props) {
  const createTask = useCreateTask();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      priority: "MEDIUM",
      dueDate: "",
    },
  });

  const selectedId = form.watch("assignedTo");
  const selectedMember = members.find((m) => m._id === selectedId);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const onSubmit = (values: FormOutput) => {
    createTask.mutate(
      {
        projectId,
        data: {
          title: values.title,
          description: values.description || undefined,
          assignedTo: values.assignedTo,
          priority: values.priority,
          dueDate: values.dueDate || undefined,
        },
      },
      { onSuccess: () => form.reset() },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <div className="flex items-start gap-2">
          {/* Task title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Task title…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority selector */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 w-28 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Assignee picker dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 shrink-0"
              >
                {selectedMember ? (
                  <>
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px]">
                        {initials(selectedMember.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-24 truncate text-xs">
                      {selectedMember.name}
                    </span>
                    <button
                      type="button"
                      className="ml-0.5 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        form.setValue("assignedTo", "");
                      }}
                    >
                      <X className="size-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <UserCircle className="size-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Assign</span>
                  </>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Assign to a developer</DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Only developers in this project can be assigned tasks.
                </p>
              </DialogHeader>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search members…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>

              {/* Member list */}
              <ScrollArea className="max-h-60">
                <div className="space-y-1">
                  {filteredMembers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No members found.
                    </p>
                  )}
                  {filteredMembers.map((m) => {
                    const isSelected = selectedId === m._id;
                    return (
                      <button
                        key={m._id}
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent ${
                          isSelected ? "bg-accent" : ""
                        }`}
                        onClick={() => {
                          form.setValue("assignedTo", m._id);
                          setDialogOpen(false);
                          setSearch("");
                        }}
                      >
                        <Avatar size="sm">
                          <AvatarFallback className="text-[10px]">
                            {initials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {m.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {m.email}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="size-4 text-primary shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Submit */}
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={createTask.isPending}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Assignee validation message */}
        <FormField
          control={form.control}
          name="assignedTo"
          render={() => (
            <FormItem className="hidden">
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
