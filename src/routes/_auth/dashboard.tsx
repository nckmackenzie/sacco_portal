import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import clsx from 'clsx'

import { ErrorComponent } from '@/components/custom/error'
import { dashboardQueryOptions } from '@/features/dashboard/services/query-options'
import { DashboardStats } from '@/features/dashboard/components/dashboard-stats'
import { RecentTransactions } from '@/features/dashboard/components/recent-transactions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDocumentTitle } from '@/hooks/use-title'
import { formatCurrency, formatDate, getLoanStatus } from '@/lib/formatters'
import { Progress } from '@/components/ui/progress'
import { LoanStatus } from '@/features/dashboard/components/loan-status'
import { Button } from '@/components/ui/button'

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
      {data.requests > 0 && (
        <div className="bg-warning max-w-2xl mx-auto rounded-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold">Welcome back!</h2>
              <p className="text-sm text-muted-foreground">
                You have {data.requests} pending{' '}
                {data.requests > 1 ? 'requests' : 'request'} to review.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="border border-warning-foreground/80 hover:bg-warning-foreground/10"
            >
              <Link
                to="/pending-requests"
                className="text-xs font-semibold text-accent-foreground dark:text-white"
              >
                Let&apos;s go
              </Link>
            </Button>
          </div>
        </div>
      )}
      <DashboardStats data={data.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions data={data.transactions.splice(0, 5)} />
        <Card className="shadow-none col-span-1 lg:col-span-2 self-start">
          <CardHeader className="flex flex-row items-center justify-between ">
            <div>
              <CardTitle className="text-lg font-semibold ">
                Active / Pending Loan(s)
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Your active loans or pending applications.
              </CardDescription>
            </div>
            {data.loans.length > 0 && (
              <Link
                to="/transactions"
                className="text-link text-xs font-semibold"
              >
                View All
              </Link>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {data.loans.length > 0 ? (
              data.loans.map(
                ({
                  id,
                  loanType: { name },
                  loanAmount,
                  loanBalance,
                  applicationDate,
                  nextDueDate,
                  purpose,
                  loanStatus,
                  completedAt,
                  writtenOff,
                }) => {
                  const loanProgress = Math.round(
                    ((loanAmount - loanBalance) / loanAmount) * 100,
                  )
                  const status = getLoanStatus(
                    loanStatus,
                    completedAt ? new Date(completedAt) : null,
                    nextDueDate ? new Date(nextDueDate) : null,
                    loanBalance || 0,
                    writtenOff,
                  )
                  return (
                    <div
                      key={id}
                      className={clsx('rounded-md border p-4', {
                        'border-l-4 border-l-error': status === 'overdue',
                      })}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <h4 className="font-medium">{name}</h4>
                            <p className="text-xs text-muted-foreground capitalize">
                              {purpose}
                            </p>
                          </div>
                          <LoanStatus status={status} />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(loanAmount)}
                          </p>
                          {loanStatus === 'approved' && (
                            <p className="text-xs text-muted-foreground">
                              Remaining: {formatCurrency(loanBalance)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Repayment Progress</span>
                          <span>{loanProgress}%</span>
                        </div>
                        <Progress value={loanProgress} className="h-2" />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Application Date:{' '}
                          </span>
                          <span>{formatDate(applicationDate)}</span>
                        </div>
                        {nextDueDate && (
                          <div className="text-right">
                            <span className="text-muted-foreground">
                              Due Date:{' '}
                            </span>
                            <span>{formatDate(nextDueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                },
              )
            ) : (
              <p className="text-base text-muted-foreground mt-1 text-center">
                No active loans available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* <FullPageLoader message="Fetching your data..." /> */}
    </div>
  )
}
