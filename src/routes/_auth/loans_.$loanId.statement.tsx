import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/loans_/$loanId/statement')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/loans_/$loanId/statement"!</div>
}
