import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from '../components/ui/skeleton'
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'

export const Route = createFileRoute('/dashboardSkeleton')({
  component: DashboardSkeleton,
})

/* ─── Sidebar ─── */
function SidebarSkeleton() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: FolderKanban, label: 'Projects' },
    { icon: CalendarDays, label: 'Calendar' },
    { icon: Users, label: 'Team' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: BarChart3, label: 'Reports' },
    { icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 animate-pulse" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Workspace switcher */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent px-3 py-2.5 cursor-pointer">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {navItems.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              i === 0
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
            {i === 4 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-400">
                3
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom projects list */}
      <div className="px-3 pb-2">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Projects
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ─── Top Bar ─── */
function TopBarSkeleton() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md lg:hidden" />
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Skeleton className="h-3.5 w-16" />
          <span>/</span>
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>

      {/* Center: search */}
      <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 w-80">
        <Search className="h-4 w-4 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground/50">Search projects, tasks, people…</span>
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <div className="relative rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer">
          <Bell className="h-[18px] w-[18px] text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-card" />
        </div>
        <div className="rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer">
          <Plus className="h-[18px] w-[18px] text-muted-foreground" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full ml-1" />
      </div>
    </header>
  )
}

/* ─── Stat Cards ─── */
function StatCardsSkeleton() {
  const stats = [
    { icon: FolderKanban, color: 'text-indigo-500 bg-indigo-500/10' },
    { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { icon: TrendingUp, color: 'text-cyan-500 bg-cyan-500/10' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <div className={`rounded-lg p-2 ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-16" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          {/* Mini sparkline */}
          <div className="flex items-end gap-[3px] h-8 pt-1">
            {Array.from({ length: 12 }).map((_, j) => (
              <Skeleton
                key={j}
                className="flex-1 rounded-sm"
                style={{ height: `${Math.random() * 70 + 30}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Project Board / Kanban Preview ─── */
function KanbanSkeleton() {
  const columns = [
    { title: 'To Do', count: 4, dot: 'bg-slate-400' },
    { title: 'In Progress', count: 3, dot: 'bg-amber-400' },
    { title: 'In Review', count: 2, dot: 'bg-indigo-400' },
    { title: 'Done', count: 5, dot: 'bg-emerald-400' },
  ]

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 divide-x divide-border">
        {columns.map((col) => (
          <div key={col.title} className="p-4 space-y-3 min-h-[280px]">
            {/* Column header */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                <span className="text-sm font-medium text-foreground">{col.title}</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-muted px-1 text-[11px] font-medium text-muted-foreground">
                  {col.count}
                </span>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground/40 cursor-pointer hover:text-muted-foreground transition-colors" />
            </div>

            {/* Task cards */}
            {Array.from({ length: Math.min(col.count, 3) }).map((_, j) => (
              <div
                key={j}
                className="rounded-lg border border-border bg-background p-3.5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-14 rounded-full" />
                  {j === 0 && <Skeleton className="h-4 w-12 rounded-full" />}
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: Math.min(j + 2, 3) }).map((_, k) => (
                      <Skeleton key={k} className="h-6 w-6 rounded-full ring-2 ring-background" />
                    ))}
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Activity Feed ─── */
function ActivitySkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3.5 w-16" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3.5">
            <Skeleton className="h-8 w-8 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-full max-w-[260px]" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-10 shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Team Members ─── */
function TeamSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="relative">
              <Skeleton className="h-9 w-9 rounded-full" />
              <span
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-card ${
                  i < 2 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-500' : 'bg-slate-400'
                }`}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Upcoming Deadlines ─── */
function DeadlinesSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3.5 w-14" />
      </div>
      <div className="p-4 space-y-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${
                i === 0
                  ? 'bg-red-500/10 text-red-500'
                  : i === 1
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <Skeleton className="h-3 w-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Chart placeholder ─── */
function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="p-5">
        {/* Y-axis labels + bars */}
        <div className="flex gap-3">
          <div className="flex flex-col justify-between py-1 text-[11px] text-muted-foreground/50">
            {['100', '75', '50', '25', '0'].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          <div className="flex-1 flex items-end gap-2 h-44 border-b border-l border-border pl-1 pb-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex items-end gap-[2px]">
                <Skeleton
                  className="flex-1 rounded-t-sm"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
                <Skeleton
                  className="flex-1 rounded-t-sm opacity-50"
                  style={{ height: `${Math.random() * 50 + 15}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* X-axis labels */}
        <div className="flex gap-2 pl-10 pt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d} className="flex-1 text-center text-[11px] text-muted-foreground/50">
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─── */
function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarSkeleton />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBarSkeleton />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] p-4 md:p-6 space-y-6">
            {/* Page title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-36 rounded-lg" />
              </div>
            </div>

            {/* Stats */}
            <StatCardsSkeleton />

            {/* Kanban + Chart row */}
            <div className="grid grid-cols-1 2xl:grid-cols-[1fr_420px] gap-6">
              <KanbanSkeleton />
              <div className="space-y-6">
                <ChartSkeleton />
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ActivitySkeleton />
              <TeamSkeleton />
              <DeadlinesSkeleton />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
