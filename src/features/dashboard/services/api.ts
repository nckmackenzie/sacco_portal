import type {
  MemberStats,
  MemberTransaction,
} from '@/features/dashboard/utils/dashboard.types'
import axios from '@/lib/api/axios'

export async function fetchDashboardData(): Promise<{
  data: { stats: MemberStats; transactions: Array<MemberTransaction> }
}> {
  try {
    const { data } = await axios('/api/dashboard/stats')

    return data
  } catch (error) {
    throw new Error('Error fetching dashboard member stats')
  }
}
