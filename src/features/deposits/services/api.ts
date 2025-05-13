import type { Deposit } from '@/features/deposits/utils/deposit.types'
import axios from '@/lib/api/axios'

interface FetchDepositsParams {
  q?: string
  from?: string
  to?: string
}

export async function fetchDeposits(
  params: FetchDepositsParams = {},
): Promise<{ data: Array<Deposit> }> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })

  try {
    const { data } = await axios(`/api/deposits?${searchParams.toString()}`)

    return data
  } catch (error) {
    console.error('Error fetching deposits:', error)
    throw new Error('An error occurred while fetching deposits.')
  }
}
