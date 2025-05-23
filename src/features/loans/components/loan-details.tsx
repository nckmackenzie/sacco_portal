import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, XIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { LoanDetailed } from '@/features/loans/utils/loans.type'
import { getLoanStatus, muatationErrorHandler } from '@/lib/formatters'
import { Button } from '@/components/ui/button'

import axios from '@/lib/api/axios'
import { loanRef } from '@/features/loans/components/loan-table'
import { Header } from '@/features/loans/components/loan-header'
import { LoanOverview } from '@/features/loans/components/loan-overview'
import { TabbedContent } from '@/features/loans/components/tabbed-content'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function LoanDetails({ loan }: { loan: LoanDetailed }) {
  const {
    id,
    applicationDate,
    purpose,
    loanId: loanReference,
    repaymentPeriod,
    loanStatus,
    completedAt,
    loanType: { name: loanName, alias },
    loanAmount,
    balance,
    nextDueDate,
    writtenOff,
    remarks,
  } = loan

  const formattedLoanReference = loanRef(
    alias,
    new Date(applicationDate),
    loanReference,
  )

  const status = getLoanStatus(
    loanStatus,
    completedAt ? new Date(completedAt) : null,
    loan.nextDueDate ? new Date(loan.nextDueDate) : null,
    loan.balance || 0,
    writtenOff,
  )

  const navigate = useNavigate({ from: '/loans/$loanId' })
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await axios.delete('/api/loans/' + id)
    },
    onError: (error) => {
      const errorMessage = muatationErrorHandler(error)
      toast.error(errorMessage)
    },
    onSuccess: () => {
      toast.success('Loan cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      navigate({ to: '/loans' })
    },
  })
  return (
    <div className="space-y-6">
      <Header
        id={id}
        loanName={loanName}
        loanReference={formattedLoanReference}
        purpose={purpose}
        repaymentPeriod={repaymentPeriod}
        status={status}
        loanAmount={loanAmount}
        monthlyPayment={Math.round(loanAmount / repaymentPeriod)}
        nextDueDate={nextDueDate ?? undefined}
      />
      <LoanOverview
        monthlyPayment={loanAmount / repaymentPeriod}
        loanAmount={loanAmount}
        loanBalance={balance}
        nextDueDate={nextDueDate}
        applicationDate={new Date(applicationDate)}
        status={status}
        completedAt={completedAt ? new Date(completedAt) : null}
        remarks={remarks}
      />

      <TabbedContent
        loanDetails={loan}
        loanReference={formattedLoanReference}
        status={status}
      />
      {status === 'pending' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto gap-1"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 aria-hidden className="icon animate-spin" />
              ) : (
                <XIcon aria-hidden className="icon" />
              )}
              <span>Cancel Loan</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => mutate()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
