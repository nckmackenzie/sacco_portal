import type { PaymentMethod, WithId } from '@/types/index.types'

export interface Deposit extends WithId {
  transactionCode: string
  depositDate: Date
  amount: number
  sinkingFund: number
  description: string | null
  paymentMethod: PaymentMethod | null
  paymentReference: string | null
}
