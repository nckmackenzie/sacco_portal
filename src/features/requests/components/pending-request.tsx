import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  InfoIcon,
  Loader2Icon,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { LoanRequest } from '@/features/requests/utils/requests.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { formatCurrency, formatDate, getInitials } from '@/lib/formatters'

import axios from '@/lib/api/axios'

export function PendingRequest({ request }: { request: LoanRequest }) {
  const [actionType, setActionType] = React.useState<
    'approve' | 'reject' | null
  >(null)
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const {
    createdAt,
    guarantingAmount,
    loan: {
      applicationDate,
      repaymentPeriod,
      id,
      loanAmount,
      loanType: { name: loanType },
      purpose,
      member: { name, photo, registrationDate },
    },
    otherGuarantors,
  } = request

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: 'approved' | 'rejected') => {
      await axios.patch('/api/loan-requests/' + id, { status: data })
      return data
    },
    onSuccess: (data) => {
      toast.success(`Request ${data} successfully`)
      queryClient.invalidateQueries({ queryKey: ['pending requests'] })
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error || err.response?.data.message)
      } else {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('An unexpected error occurred.')
        }
      }
    },
    onSettled: () => setOpen(false),
  })

  function handleOpenModal(type: 'approve' | 'reject') {
    setActionType(type)
    setOpen(true)
  }

  return (
    <>
      <Card className="overflow-hidden transition-all shadow-none hover:shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photo ?? undefined} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base uppercase">{name}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Member Since {formatDate(registrationDate)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-2">
          <div className="rounded-md bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <DollarSignIcon className="h-4 w-4 text-primary" />
              <span>Loan Details</span>
            </div>
            <div className="flex flex-col gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{loanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repayment Period:</span>
                <span className="font-medium">{repaymentPeriod} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium capitalize">{purpose}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Request Date:</span>
              </div>
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Loan Date:</span>
              </div>
              <span>{formatDate(applicationDate)}</span>
            </div>
          </div>

          <div className="rounded-md bg-warning/30 p-3">
            <div className="mb-2 text-sm font-medium">Your Responsibility</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Guaranteed Amount:</span>
              <span className="font-medium">
                {formatCurrency(guarantingAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Other Guarantors:</span>
              <span className="font-medium">{otherGuarantors}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => handleOpenModal('reject')}
            disabled={isPending}
          >
            <X aria-hidden className="h-4 w-4" />
            <span>Reject</span>
          </Button>
          <Button
            className="flex-1 bg-success text-success-foreground hover:bg-success/90 hover:text-success-foreground"
            variant="ghost"
            onClick={() => handleOpenModal('approve')}
            disabled={isPending}
          >
            <CheckIcon className="h-4 w-4" />
            <span>Approve</span>
          </Button>
        </CardFooter>
      </Card>
      <>
        <Dialog open={open && actionType === 'reject'} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Guarantor Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this guarantor request? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => mutate('rejected')}
                disabled={isPending}
              >
                {isPending && <Loader2Icon className="icon animate-spin" />}
                Reject Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={open && actionType === 'approve'} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Guarantor Request</DialogTitle>
              <DialogDescription>
                You are about to approve this loan.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md bg-warning p-4  text-warning-foreground flex gap-2">
                <InfoIcon size={24} className="shrink-0" />
                <span className="text-sm">
                  <strong>Important:</strong> As a guarantor, you are agreeing
                  to take the responsibility of repaying the loan if the
                  applicant is unable to do so. Please review all details
                  carefully.
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={() => mutate('approved')} disabled={isPending}>
                {isPending && <Loader2Icon className="icon animate-spin" />}
                Approve Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </>
  )
}
