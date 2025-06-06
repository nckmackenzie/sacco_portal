import type {
  Loan,
  LoanDetailed,
  LoanStatement,
} from '@/features/loans/utils/loans.type'
import type { LoanStatus } from '@/routes/_auth/loans'
import axios from '@/lib/api/axios'
import { fetchErrorHandler } from '@/lib/formatters'

interface FetchLoansParams {
  q?: string
  status?: LoanStatus
  loanType?: string
}

export async function fetchMemberLoanStatus(): Promise<{
  data: {
    totalLoanBalance: number
    loanLimit: number
    deposits: number
  }
}> {
  try {
    const { data } = await axios('/api/member-loan-status')

    return data
  } catch (error) {
    console.error('Error fetching member loan status:', error)
    throw new Error('Failed to fetch member loan status')
  }
}

export async function fetchLoanTypes(): Promise<{
  data: Array<{
    id: string
    name: string
    maximumRepayment: number
    isActive: boolean
  }>
}> {
  try {
    const { data } = await axios('/api/loan-types/min')

    return data
  } catch (error) {
    console.error('Error fetching loans:', error)
    throw new Error('Failed to fetch loan types')
  }
}

export async function fetchLoans(
  params: FetchLoansParams = {},
): Promise<{ data: Array<Loan> }> {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })

  try {
    const { data } = await axios('/api/loans?' + searchParams.toString())

    return data
  } catch (error) {
    const err = fetchErrorHandler(error)
    throw new Error(err)
  }
}

export async function fetchLoan(id: string): Promise<{ data: LoanDetailed }> {
  try {
    const { data } = await axios(`/api/loans/${id}/view`)

    return data
  } catch (error) {
    const err = fetchErrorHandler(error)
    throw new Error(err)
  }
}

export async function fetchLoanStatement(
  id: string,
): Promise<{ data: LoanStatement }> {
  try {
    const { data } = await axios(`/api/loans/${id}/statement`)

    return data
  } catch (error) {
    const err = fetchErrorHandler(error)
    throw new Error(err)
  }
}
