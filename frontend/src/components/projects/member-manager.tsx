import { useState } from "react";
import { useAddMember } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail } from "lucide-react";
import { isAxiosError } from "axios";
import type { ProjectMember, ProjectRole } from "@/types/project";

const roleColors: Record<ProjectRole, string> = {
  PO: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  PM: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  DEVELOPER: "bg-green-500/15 text-green-700 dark:text-green-400",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface Props {
  projectId: string;
  members: ProjectMember[];
  /** When true, only DEVELOPER role is selectable (PO/PM callers) */
  devOnly?: boolean;
}

export function MemberManager({ projectId, members, devOnly = false }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<ProjectRole>("DEVELOPER");
  const addMember = useAddMember();

  const errorMessage = addMember.isError
    ? isAxiosError(addMember.error)
      ? addMember.error.response?.data?.message
      : addMember.error.message
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    addMember.mutate(
      { projectId, data: { email: email.trim(), role: selectedRole } },
      {
        onSuccess: () => {
          setEmail("");
          setOpen(false);
          addMember.reset();
        },
      },
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">
        Members ({members.length})
      </p>

      {/* Member list with roles */}
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <div
            key={m.user._id}
            className="flex items-center gap-2 rounded-md border px-2.5 py-1.5"
          >
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px] font-medium">
                {initials(m.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium leading-tight">
                {m.user.name}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {m.user.email}
              </span>
            </div>
            <Badge
              className={`ml-1 border-0 px-1.5 py-0 text-[9px] font-semibold ${roleColors[m.role]}`}
            >
              {m.role}
            </Badge>
          </div>
        ))}
      </div>

      {/* Add member dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEmail("");
            addMember.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <UserPlus className="size-3.5" />
            Add member
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a member by email</DialogTitle>
            <DialogDescription>
              Enter the email of the user you want to add and select their
              project role.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8 h-9"
                autoFocus
                required
              />
            </div>

            {/* Role selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0">
                Role:
              </span>
              <Select
                value={selectedRole}
                onValueChange={(v) => setSelectedRole(v as ProjectRole)}
              >
                <SelectTrigger className="h-9 flex-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {!devOnly && <SelectItem value="PO">Product Owner</SelectItem>}
                  {!devOnly && <SelectItem value="PM">Project Manager</SelectItem>}
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error message */}
            {errorMessage && (
              <p className="text-xs text-destructive">{errorMessage}</p>
            )}

            <DialogFooter>
              <Button
                type="submit"
                size="sm"
                disabled={addMember.isPending || !email.trim()}
                className="w-full gap-1.5"
              >
                <UserPlus className="size-4" />
                {addMember.isPending ? "Adding…" : "Add member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
