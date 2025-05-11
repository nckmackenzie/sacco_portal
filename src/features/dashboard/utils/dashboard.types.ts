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
