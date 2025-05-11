import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useDocumentTitle } from '@/hooks/use-title'

import { ErrorComponent } from '@/components/custom/error'
import { dashboardQueryOptions } from '@/features/dashboard/services/query-options'
import { DashboardStats } from '@/features/dashboard/components/dashboard-stats'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'

export const Route = createFileRoute('/_auth/dashboard')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dashboardQueryOptions()),
  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Dashboard')
  const {
    data: { data },
  } = useSuspenseQuery(dashboardQueryOptions())
  return (
    <div className="space-y-6">
      <DashboardStats data={data.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions data={data.transactions.splice(0, 5)} />
        <div className="col-span-1 lg:col-span-1">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {/* Add your notifications component here */}
        </div>
      </div>

      {/* <FullPageLoader message="Fetching your data..." /> */}
    </div>
  )
}
