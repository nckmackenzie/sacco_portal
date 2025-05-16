import { createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from '@/hooks/use-title'

export const Route = createFileRoute('/_auth/loans_/$loanId')({
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Loan Details')
  return <div>Hello "/_auth/loans_/$loanId"!</div>
}
