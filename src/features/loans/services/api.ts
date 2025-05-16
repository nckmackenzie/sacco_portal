import type { Loan } from '@/features/loans/utils/loans.type'
import type { LoanStatus } from '@/routes/_auth/loans'
import axios from '@/lib/api/axios'

interface FetchLoansParams {
  q?: string
  status?: LoanStatus
  loanType?: string
}

export async function fetchLoanTypes(): Promise<{
  data: Array<{ id: string; name: string }>
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
    console.error('Error fetching loans:', error)
    throw new Error('Failed to fetch loans')
  }
}
