import React from 'react'
import { Link } from '@tanstack/react-router'
import { CreditCardIcon, FileText, InfoIcon, MoreVertical } from 'lucide-react'
import clsx from 'clsx'
import type { ColumnDef } from '@tanstack/react-table'
import type { Loan } from '@/features/loans/utils/loans.type'
import type { LoanPaymentModalProps } from '@/features/loans/components/loan-payment-modal'
import { DataTable } from '@/components/custom/datatable'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, getLoanStatus } from '@/lib/formatters'
import { LoanStatus } from '@/features/dashboard/components/loan-status'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoanPaymentModal } from '@/features/loans/components/loan-payment-modal'
import { interestCalculator } from '@/lib/utils'

export function loanRef(
  loanAlias: string,
  applicationDate: Date,
  loanNo: number,
) {
  return `${loanAlias.toUpperCase()}/${applicationDate.getFullYear()}/${loanNo
    .toString()
    .padStart(4, '0')}`
}

export default function LoanTable({ data }: { data: Array<Loan> }) {
  const [loanDetails, setLoanDetails] = React.useState<Omit<
    LoanPaymentModalProps,
    'isOpen' | 'onOpenChange'
  > | null>(null)
  const [open, setOpen] = React.useState(false)
  const handleOpen = (
    loanId: string,
    loanInterest: number,
    monthlyPayment: number,
    nextDueDate: string | Date,
  ) => {
    setLoanDetails({ loanId, loanInterest, monthlyPayment, nextDueDate })
    setOpen(true)
  }
  const columns: Array<ColumnDef<Loan>> = [
    {
      accessorKey: 'loanId',
      header: 'Loan ID',
      cell: ({
        row: {
          original: {
            loanId,
            loanType: { alias },
            applicationDate,
          },
        },
      }) => <div>{loanRef(alias, new Date(applicationDate), loanId)}</div>,
    },
    {
      accessorKey: 'loanType.name',
      header: 'Loan Type',
      cell: ({ row }) => <div>{row.original.loanType.name}</div>,
    },

    {
      accessorKey: 'loanAmount',
      header: 'Loan Amount',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.loanAmount)}
        </div>
      ),
    },
    {
      accessorKey: 'loanBalance',
      header: 'Loan Balance',
      cell: ({
        row: {
          original: { loanBalance, loanStatus },
        },
      }) => (
        <div className="font-medium">
          {loanBalance > 0 && loanStatus === 'approved'
            ? formatCurrency(loanBalance)
            : ''}
        </div>
      ),
    },
    {
      id: 'progress',
      header: 'Progress',
      cell: ({
        row: {
          original: { loanAmount, loanBalance, loanStatus },
        },
      }) => {
        const progress = 100 - Math.round((loanBalance / loanAmount) * 100)

        if (loanStatus === 'pending' || loanStatus === 'rejected') return null
        return (
          <div className="flex flex-col items-center">
            <span className="text-xs inline-flex self-end">{progress}%</span>
            <Progress
              value={progress}
              indicatorBackground={clsx({
                'bg-emerald-300 dark:bg-emerald-700': progress === 100,
                'bg-orange-300 dark:bg-orange-700':
                  progress > 75 && progress < 100,
                'bg-red-300 dark:bg-red-700': progress < 75,
                'bg-primary': progress === 0,
              })}
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'loanStatus',
      header: 'Status',
      cell: ({
        row: {
          original: {
            completedAt,
            loanStatus,
            nextDueDate,
            writtenOff,
            loanBalance,
          },
        },
      }) => {
        const status = getLoanStatus(
          loanStatus,
          completedAt ? new Date(completedAt) : null,
          nextDueDate ? new Date(nextDueDate) : null,
          loanBalance || 0,
          writtenOff,
        )
        return <LoanStatus status={status} />
      },
    },
    {
      id: 'action',
      cell: ({
        row: {
          original: {
            loanStatus,
            id,
            repaymentPeriod,
            loanAmount,
            nextDueDate,
          },
        },
      }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="border-none outline-none cursor-pointer">
              <MoreVertical aria-hidden className="icon-muted" />
              <span className="sr-only">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="[&>*]:cursor-pointer [&>*]:text-xs [&>*]:font-medium">
            {(loanStatus === 'approved' || loanStatus === 'repaid') && (
              <>
                {loanStatus === 'approved' && (
                  <DropdownMenuItem
                    onClick={() => {
                      const interest = interestCalculator(
                        repaymentPeriod,
                        loanAmount,
                      )
                      handleOpen(
                        id,
                        +interest,
                        Math.round(loanAmount / repaymentPeriod),
                        nextDueDate ? new Date(nextDueDate) : new Date(),
                      )
                    }}
                  >
                    <CreditCardIcon className="icon" aria-hidden />
                    <span>Make Payment</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/loans/$loanId/statement" params={{ loanId: id }}>
                    <FileText className="icon" aria-hidden />
                    <span>Loan Statement</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild>
              <Link to="/loans/$loanId" params={{ loanId: id }}>
                <InfoIcon className="icon" aria-hidden />
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  return (
    <>
      <DataTable columns={columns} data={data} />
      {loanDetails && (
        <LoanPaymentModal
          isOpen={open}
          onOpenChange={setOpen}
          loanId={loanDetails.loanId}
          loanInterest={loanDetails.loanInterest}
          monthlyPayment={loanDetails.monthlyPayment}
          nextDueDate={loanDetails.nextDueDate}
        />
      )}
    </>
  )
}
