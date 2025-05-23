import type {
  DashboardLoan,
  LoanType,
} from '@/features/dashboard/utils/dashboard.types'
import type { z } from 'zod'
import type {
  loanFormSchema,
  loanPaymentFormSchema,
} from '@/features/loans/utils/loan-schema'
import type { PaymentMethod, WithIdAndName } from '@/types/index.types'
import type { LoanRequest } from '@/features/requests/utils/requests.types'

export interface Loan extends DashboardLoan {
  loanId: number
  repaymentPeriod: number
  documentUrl: string | null
  remarks: string | null
  approvalDate: Date | null
}

export interface LoanDetailed extends Omit<Loan, 'loanType'> {
  balance: number
  member: WithIdAndName & {
    memberNo: number
    registrationDate: Date
    photo: string | null
    contact: string
    dateOfBirth: Date
    status: string
    accountDetails: {
      deposits: number
      shareCapital: number
      loanLimit: number
      totalLoanBalance: number
    }
  }
  loanType: LoanType
  user: WithIdAndName
  approver: WithIdAndName | null
  guarantors: Array<{
    guarantingAmount: number
    status: LoanRequest['status']
    createdAt: Date
    member: WithIdAndName & {
      memberNo: number
      registrationDate: Date
      photo: string | null
      contact: string
    }
  }>
  payments: Array<{
    id: number
    principalAmount: number
    interestAmount: number
    paymentMethod: PaymentMethod
    paymentReference: string
    paymentDate: Date
  }>
}

export type LoanApplicationFormValues = z.infer<typeof loanFormSchema>
export type LoanPaymentFormValues = z.infer<typeof loanPaymentFormSchema>
