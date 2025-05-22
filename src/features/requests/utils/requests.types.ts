import type { DashboardLoan } from '@/features/dashboard/utils/dashboard.types'
import type { WithId } from '@/types/index.types'

export interface LoanRequest {
  createdAt: Date
  guarantingAmount: number
  otherGuarantors: number
  status: 'pending' | 'approved' | 'rejected'
  loan: Pick<
    DashboardLoan,
    'loanAmount' | 'purpose' | 'loanType' | 'applicationDate' | 'id'
  > & {
    member: WithId & {
      name: string
      registrationDate: Date
      photo: string | null
    }
    repaymentPeriod: number
  }
}
