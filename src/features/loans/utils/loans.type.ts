import type { DashboardLoan } from '@/features/dashboard/utils/dashboard.types'

export interface Loan extends DashboardLoan {
  loanId: number
  repaymentPeriod: number
  documentUrl: string | null
  remarks: string | null
  approvalDate: Date | null
}
