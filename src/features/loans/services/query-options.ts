import { queryOptions } from '@tanstack/react-query'
import type { LoanStatus } from '@/routes/_auth/loans'
import { fetchLoanTypes, fetchLoans } from '@/features/loans/services/api'

export const loanTypesQueryOptions = () =>
  queryOptions({
    queryKey: ['loan types'],
    queryFn: fetchLoanTypes,
  })

export const loansQueryOptions = (
  q?: string,
  status?: LoanStatus,
  loanType?: string,
) =>
  queryOptions({
    queryKey: ['loans', q, status, loanType],
    queryFn: () => fetchLoans({ q, status, loanType }),
  })
