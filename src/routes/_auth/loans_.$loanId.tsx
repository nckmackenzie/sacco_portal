import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useDocumentTitle } from '@/hooks/use-title'
import { loanQueryOptions } from '@/features/loans/services/query-options'
import { LoanDetails } from '@/features/loans/components/loan-details'

export const Route = createFileRoute('/_auth/loans_/$loanId')({
  loader: ({ context, params: { loanId } }) =>
    context.queryClient.ensureQueryData(loanQueryOptions(loanId)),
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Loan Details')
  const { loanId } = Route.useParams()
  const {
    data: { data: loan },
  } = useSuspenseQuery(loanQueryOptions(loanId))
  return <LoanDetails loan={loan} />
}
