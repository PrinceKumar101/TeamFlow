import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/testing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/testing"!</div>
}
