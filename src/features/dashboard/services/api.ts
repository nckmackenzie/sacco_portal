import type {
  DashboardLoan,
  MemberStats,
  MemberTransaction,
} from '@/features/dashboard/utils/dashboard.types'
import axios from '@/lib/api/axios'

export async function fetchDashboardData(): Promise<{
  data: {
    stats: MemberStats
    transactions: Array<MemberTransaction>
    loans: Array<DashboardLoan>
  }
}> {
  try {
    const { data } = await axios('/api/dashboard/stats')

    return data
  } catch (error) {
    throw new Error('Error fetching dashboard member stats')
  }
}
