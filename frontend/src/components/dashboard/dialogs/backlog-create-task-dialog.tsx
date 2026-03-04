import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask } from "@/hooks/useProjects";
import { useAppSelector } from "@/hooks/redux";
import { canCreateTask } from "@/hooks/useProjectRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Search, Check, UserCircle, X } from "lucide-react";
import type { ProjectItem, UserInfo } from "@/types/project";

const schema = z.object({
  projectId: z.string().min(1, "Select a project"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  projects: ProjectItem[];
  trigger?: React.ReactNode;
}

export function BacklogCreateTaskDialog({ projects, trigger }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const globalRole = user?.role ?? null;
  const createTask = useCreateTask();

  const [open, setOpen] = useState(false);
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: "",
      title: "",
      description: "",
      assignedTo: "",
      priority: "MEDIUM",
      dueDate: "",
    },
  });

  const selectedProjectId = form.watch("projectId");
  const selectedAssigneeId = form.watch("assignedTo");

  // Projects user can create tasks in (ADMIN / PO / PM)
  const creatableProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.status === "ARCHIVED") return false;
      const membership = p.members.find((m) => m.user._id === user?.id);
      const projectRole = membership?.role ?? null;
      return canCreateTask(projectRole, globalRole);
    });
  }, [projects, user, globalRole]);

  // DEVELOPERs in the selected project
  const developers: UserInfo[] = useMemo(() => {
    const project = projects.find((p) => p._id === selectedProjectId);
    if (!project) return [];
    return project.members
      .filter((m) => m.role === "DEVELOPER")
      .map((m) => m.user);
  }, [projects, selectedProjectId]);

  const selectedMember = developers.find((m) => m._id === selectedAssigneeId);

  const filteredDevs = developers.filter(
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

  const onSubmit = (values: FormValues) => {
    createTask.mutate(
      {
        projectId: values.projectId,
        data: {
          title: values.title,
          description: values.description || undefined,
          assignedTo: values.assignedTo,
          priority: values.priority,
          dueDate: values.dueDate || undefined,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  // Reset assignee when project changes
  const handleProjectChange = (projectId: string) => {
    form.setValue("projectId", projectId);
    form.setValue("assignedTo", "");
  };

  if (creatableProjects.length === 0) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          form.reset();
          createTask.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to a project backlog.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Project selector */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleProjectChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {creatableProjects.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description…"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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

              {/* Due date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Assignee picker */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={() => (
                <FormItem>
                  <FormLabel>Assign to Developer</FormLabel>
                  {!selectedProjectId ? (
                    <p className="text-xs text-muted-foreground">
                      Select a project first.
                    </p>
                  ) : developers.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No developers in this project. Add a developer member
                      first.
                    </p>
                  ) : (
                    <Dialog
                      open={assigneeDialogOpen}
                      onOpenChange={setAssigneeDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 h-9"
                        >
                          {selectedMember ? (
                            <>
                              <Avatar className="size-5">
                                <AvatarFallback className="text-[9px]">
                                  {initials(selectedMember.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate text-sm">
                                {selectedMember.name}
                              </span>
                              <button
                                type="button"
                                className="ml-auto hover:text-destructive"
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
                              <span className="text-sm text-muted-foreground">
                                Select assignee…
                              </span>
                            </>
                          )}
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Assign to a developer</DialogTitle>
                        </DialogHeader>

                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            placeholder="Search members…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 h-9"
                          />
                        </div>

                        <ScrollArea className="max-h-60">
                          <div className="space-y-1">
                            {filteredDevs.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No members found.
                              </p>
                            )}
                            {filteredDevs.map((m) => {
                              const isSelected = selectedAssigneeId === m._id;
                              return (
                                <button
                                  key={m._id}
                                  type="button"
                                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent ${
                                    isSelected ? "bg-accent" : ""
                                  }`}
                                  onClick={() => {
                                    form.setValue("assignedTo", m._id);
                                    setAssigneeDialogOpen(false);
                                    setSearch("");
                                  }}
                                >
                                  <Avatar className="size-7">
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
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error from API */}
            {createTask.isError && (
              <p className="text-xs text-destructive">
                {createTask.error instanceof Error
                  ? createTask.error.message
                  : "Failed to create task"}
              </p>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={createTask.isPending}
                className="w-full gap-1.5"
              >
                <Plus className="size-4" />
                {createTask.isPending ? "Creating…" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
