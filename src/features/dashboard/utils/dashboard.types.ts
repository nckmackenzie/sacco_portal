import type { PaymentMethod, WithId } from '@/types/index.types'

export interface MemberStats {
  deposits: number
  shareCapital: number
  totalLoanBalance: number
  loanLimit: number
  loansGuaranteed: number
}

export interface MemberTransaction extends WithId {
  txnDate: Date
  amount: number
  paymentMethod: PaymentMethod | null
  paymentReference: string | null
  transactionType: string
}

export interface LoanType extends WithId {
  name: string
  alias: string
}

export interface DashboardLoan extends WithId {
  loanAmount: number
  applicationDate: Date
  purpose: string
  loanStatus: 'approved' | 'pending' | 'rejected' | 'repaid'
  completedAt: Date | null
  loanBalance: number
  loanType: LoanType
  writtenOff: boolean
  writtenOffDate: Date | null
  nextDueDate: Date | null
  approvalDate: Date | null
}
