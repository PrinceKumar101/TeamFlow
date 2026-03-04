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
  FormLabel,
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

type FormValues = z.infer<typeof schema>;

interface Props {
  projectId: string;
  parentTaskId: string;
  members: UserInfo[];
}

export function AddSubtaskForm({ projectId, parentTaskId, members }: Props) {
  const createTask = useCreateTask();
  const [open, setOpen] = useState(false);
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<FormValues>({
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

  const onSubmit = (values: FormValues) => {
    createTask.mutate(
      {
        projectId,
        data: {
          title: values.title,
          description: values.description || undefined,
          assignedTo: values.assignedTo,
          priority: values.priority,
          dueDate: values.dueDate || undefined,
          parentTaskId,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3" />
          Add subtask
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subtask</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Subtask title…" {...field} />
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start gap-3">
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
                        <SelectTrigger className="h-9 text-xs">
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

              {/* Due date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Due date (optional)</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-xs" {...field} />
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
                  <FormLabel>Assign to</FormLabel>
                  <div>
                    <Dialog
                      open={assigneeDialogOpen}
                      onOpenChange={setAssigneeDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-full justify-start gap-2"
                        >
                          {selectedMember ? (
                            <>
                              <Avatar className="size-5">
                                <AvatarFallback className="text-[9px]">
                                  {initials(selectedMember.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate text-xs">
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
                              <span className="text-xs text-muted-foreground">
                                Select a developer…
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
                                    setAssigneeDialogOpen(false);
                                    setSearch("");
                                  }}
                                >
                                  <Avatar className="size-6">
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={createTask.isPending}>
                {createTask.isPending ? "Adding…" : "Add Subtask"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
