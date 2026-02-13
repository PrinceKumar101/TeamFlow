import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/sprintBacklog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/sprintBacklog"!</div>
}
