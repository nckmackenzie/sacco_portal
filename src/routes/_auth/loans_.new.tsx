import { createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from '@/hooks/use-title'

export const Route = createFileRoute('/_auth/loans_/new')({
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Apply for a loan')
  return <div>Hello "/_auth/loans/new"!</div>
}
