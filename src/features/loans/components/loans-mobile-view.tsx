import { Link } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import clsx from 'clsx'
import type { Loan } from '@/features/loans/utils/loans.type'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency, formatDate, getLoanStatus } from '@/lib/formatters'
import { LoanStatus } from '@/features/dashboard/components/loan-status'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { loanRef } from '@/features/loans/components/loan-table'

export default function LoansMobileView({ loans }: { loans: Array<Loan> }) {
  return (
    <div className="md:hidden space-y-6 ">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  )
}

function LoanCard({ loan }: { loan: Loan }) {
  const {
    applicationDate,
    loanType: { alias, name },
    approvalDate,
    completedAt,
    id,
    loanAmount,
    loanBalance,
    loanId,
    loanStatus,
    nextDueDate,
    purpose,
    writtenOff,
    repaymentPeriod,
  } = loan
  const loanNo = loanRef(alias, new Date(applicationDate), loanId)
  const progress = 100 - Math.round((loanBalance / loanAmount) * 100)
  const status = getLoanStatus(
    loanStatus,
    completedAt,
    nextDueDate,
    loanBalance,
    writtenOff,
  )
  return (
    <Card className="overflow-hidden pb-0  shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{loanNo}</CardTitle>
          <LoanStatus status={status} />
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Loan Amount
            </p>
            <p className="text-base font-semibold">
              {formatCurrency(loanAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Balance</p>
            <p className="text-base font-semibold">
              {/* {formatCurrency(loanBalance)} */}
              {loanBalance > 0 && loanStatus === 'approved'
                ? formatCurrency(loanBalance)
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Application Date
            </p>
            <p className="text-sm ">{formatDate(applicationDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Approval Date
            </p>
            <p className="text-sm ">
              {approvalDate ? formatDate(approvalDate) : 'Not Approved'}
            </p>
          </div>
        </div>

        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-medium ">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            indicatorBackground={clsx({
              'bg-emerald-300 dark:bg-emerald-700': progress === 100,
              'bg-orange-300 dark:bg-orange-700':
                progress > 75 && progress < 100,
              'bg-red-300 dark:bg-red-700': progress < 75,
              'bg-primary': progress === 0,
            })}
          />
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Purpose:
            </span>
            <span className="text-xs capitalize">{purpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Repayment Period:
            </span>
            <span className="text-xs">
              {repaymentPeriod} {repaymentPeriod > 1 ? ' months' : ' month'}
            </span>
          </div>
          {loan.nextDueDate && (
            <div className="flex justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Next Due Date:
              </span>
              <span className="text-xs">
                {nextDueDate ? formatDate(nextDueDate) : ''}
              </span>
            </div>
          )}
          {loan.completedAt && (
            <div className="flex justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Completed At:
              </span>
              <span className="text-xs">
                {completedAt ? formatDate(completedAt) : 'Not Completed'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-4 py-2">
        <Button variant="ghost" size="sm" className="ml-auto " asChild>
          <Link
            to="/loans/$loanId"
            params={{ loanId: id }}
            className="text-link font-medium"
          >
            View Details
            <ChevronRightIcon className="ml-1 icon" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
