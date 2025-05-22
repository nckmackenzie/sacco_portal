import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FrownIcon } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/use-title'
import { pendingRequestOptions } from '@/features/requests/services/query-options'
import { PendingRequest } from '@/features/requests/components/pending-request'

export const Route = createFileRoute('/_auth/pending-requests')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(pendingRequestOptions()),
  component: PendingRequestsComponent,
})

function PendingRequestsComponent() {
  useDocumentTitle('Pending Requests')
  const {
    data: { data },
  } = useSuspenseQuery(pendingRequestOptions())
  const totalRequests = data.length
  return (
    <div className="space-y-6">
      <header className="">
        <h1 className="text-2xl font-bold">Pending Loan Requests</h1>
        {
          <p className="text-sm text-muted-foreground">
            {totalRequests > 0
              ? `You have ${totalRequests} pending
            ${totalRequests > 1 ? 'requests' : 'request'} to review`
              : 'No pending requests'}
            .
          </p>
        }
      </header>
      <div className="grid md:grid-cols-3">
        {totalRequests > 0 ? (
          data.map((d) => <PendingRequest key={d.loan.id} request={d} />)
        ) : (
          <div className="col-span-3 flex flex-col h-[calc(100vh-16rem)] items-center justify-center">
            <div className="size-16 bg-muted  flex items-center justify-center rounded-full">
              <FrownIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="mt-4 text-lg font-semibold text-muted-foreground text-center">
                No pending requests
              </h2>
              <p className="text-sm text-muted-foreground">
                You have no pending requests at the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
