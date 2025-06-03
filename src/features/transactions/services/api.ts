import type { MemberTransaction } from '@/features/dashboard/utils/dashboard.types'
import axios from '@/lib/api/axios'

export async function fetchAllTransactions(
  query?: string,
): Promise<{ data: Array<MemberTransaction> }> {
  const params = new URLSearchParams()
  if (query) {
    params.append('q', query)
  }

  try {
    const { data } = await axios(`/api/activities?${params.toString()}`)

    return data
  } catch (error) {
    throw new Error('Error fetching all transactions')
  }
}
