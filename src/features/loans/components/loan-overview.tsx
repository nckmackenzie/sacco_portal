import { addMonths, format } from 'date-fns'
import clsx from 'clsx'

import type { getLoanStatus } from '@/lib/formatters'
import { formatCurrency } from '@/lib/formatters'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface LoanOverviewProps {
  applicationDate: Date
  loanAmount: number
  loanBalance: number
  monthlyPayment: number
  nextDueDate: Date | null
  completedAt: Date | null
  status: ReturnType<typeof getLoanStatus>
  remarks: string | null
}

export function LoanOverview({
  applicationDate,
  loanAmount,
  loanBalance,
  monthlyPayment,
  nextDueDate,
  status,
  completedAt,
  remarks,
}: LoanOverviewProps) {
  const loanProgress = ((loanAmount - loanBalance) / loanAmount) * 100
  const expectedEndDate =
    status === 'completed' && completedAt
      ? completedAt
      : addMonths(applicationDate, 36)
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>Loan Overview</CardTitle>
        <CardDescription>
          Applied on {format(applicationDate, 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Loan Amount
            </p>
            <p className="text-2xl font-bold">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Remaining Balance
            </p>
            <p className="text-2xl font-bold">{formatCurrency(loanBalance)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Monthly Payment
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
          {nextDueDate && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Next Payment
              </p>
              <p className="text-2xl font-bold">
                {format(nextDueDate, 'MMM d, yyyy')}
              </p>
            </div>
          )}
        </div>

        {status !== 'rejected' && status !== 'written-off' && (
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{loanProgress.toFixed(2)}% Paid</span>
            </div>
            <Progress
              value={loanProgress}
              className="h-2"
              indicatorBackground={clsx({
                'bg-emerald-300 dark:bg-emerald-700': loanProgress === 100,
                'bg-orange-300 dark:bg-orange-700':
                  loanProgress > 75 && loanProgress < 100,
                'bg-red-300 dark:bg-red-700': loanProgress < 75,
                'bg-primary': loanProgress === 0,
              })}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Applied On {format(applicationDate, 'dd MMM yyyy')}</span>
              <span>
                {status === 'completed' ? 'Completed' : 'Completes'} on{' '}
                {format(expectedEndDate, 'MMM yyyy')}
              </span>
            </div>
          </div>
        )}
        {status === 'rejected' && (
          <div className="space-y-2 mt-8">
            <p className="text-sm font-medium text-muted-foreground">
              Reason for rejection
            </p>
            <p className="text-xl font-bold text-destructive capitalize">
              {remarks ?? 'No remarks provided'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
