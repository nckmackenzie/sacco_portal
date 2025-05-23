import { queryOptions } from '@tanstack/react-query'
import type { LoanStatus } from '@/routes/_auth/loans'
import {
  fetchLoan,
  fetchLoanTypes,
  fetchLoans,
  fetchMemberLoanStatus,
} from '@/features/loans/services/api'

export const loanTypesQueryOptions = () =>
  queryOptions({
    queryKey: ['loan types'],
    queryFn: fetchLoanTypes,
  })

export const memberLoanStatusQueryOptions = () =>
  queryOptions({
    queryKey: ['loan status'],
    queryFn: fetchMemberLoanStatus,
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

export const loanQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['loans', id],
    queryFn: () => fetchLoan(id),
  })
