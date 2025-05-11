import { queryOptions } from '@tanstack/react-query'
import { fetchDashboardData } from '@/features/dashboard/services/api'

export const dashboardQueryOptions = () =>
  queryOptions({ queryKey: ['dashboard stats'], queryFn: fetchDashboardData })
