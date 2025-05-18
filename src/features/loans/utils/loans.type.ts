import type { DashboardLoan } from '@/features/dashboard/utils/dashboard.types'
import type { z } from 'zod'
import type { loanFormSchema } from '@/features/loans/utils/loan-schema'

export interface Loan extends DashboardLoan {
  loanId: number
  repaymentPeriod: number
  documentUrl: string | null
  remarks: string | null
  approvalDate: Date | null
}

export type LoanApplicationFormValues = z.infer<typeof loanFormSchema>
