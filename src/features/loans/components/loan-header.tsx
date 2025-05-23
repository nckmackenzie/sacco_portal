import React from 'react'
import { Link } from '@tanstack/react-router'
import { DollarSign, FileText } from 'lucide-react'

import type { getLoanStatus } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import { LoanStatus } from '@/features/dashboard/components/loan-status'
import { LoanPaymentModal } from '@/features/loans/components/loan-payment-modal'
import { interestCalculator } from '@/lib/utils'

interface HeaderProps {
  status: ReturnType<typeof getLoanStatus>
  id: string
  loanReference: string
  purpose: string
  repaymentPeriod: number
  loanName: string
  loanAmount: number
  monthlyPayment: number
  nextDueDate?: Date
}
export function Header({
  id,
  loanReference,
  status,
  purpose,
  repaymentPeriod,
  loanName,
  loanAmount,
  monthlyPayment,
  nextDueDate,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false)
  const interest = interestCalculator(repaymentPeriod, loanAmount)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex flex-col-reverse sm:flex-row sm:items-center gap-2">
            Loan {loanReference}
            <LoanStatus status={status} />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            <span className="capitalize">{purpose}</span> Loan •{' '}
            {repaymentPeriod} months • {loanName}
          </p>
        </div>
        <div className="flex gap-2">
          {status !== 'pending' && status !== 'rejected' && (
            <>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link to="/loans/$loanId/statement" params={{ loanId: id }}>
                  <FileText aria-hidden className="icon" />
                  <span>Statement</span>
                </Link>
              </Button>
              {status === 'active' ||
                (status === 'overdue' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1"
                    onClick={() => setOpen(true)}
                  >
                    <DollarSign aria-hidden className="icon" />
                    <span>Make Payment</span>
                  </Button>
                ))}
            </>
          )}
        </div>
      </div>
      {(status === 'active' || status === 'overdue') && (
        <LoanPaymentModal
          isOpen={open}
          onOpenChange={setOpen}
          loanId={id}
          monthlyPayment={monthlyPayment}
          nextDueDate={nextDueDate!}
          loanInterest={Number(interest)}
        />
      )}
    </>
  )
}
