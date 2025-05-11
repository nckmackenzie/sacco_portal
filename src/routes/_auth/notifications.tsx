import { createFileRoute } from '@tanstack/react-router'
import { ErrorComponent } from '@/components/custom/error'

export const Route = createFileRoute('/_auth/notifications')({
  component: RouteComponent,
  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
})

function RouteComponent() {
  return <div>Hello "/_auth/notifications"!</div>
}
