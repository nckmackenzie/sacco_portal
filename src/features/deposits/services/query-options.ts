import { queryOptions } from '@tanstack/react-query'
import { fetchDeposits } from '@/features/deposits/services/api'

export const depositsQueryOptions = (
  query?: string,
  from?: string,
  to?: string,
) =>
  queryOptions({
    queryKey: ['deposits', query, from, to],
    queryFn: () => fetchDeposits({ q: query, from, to }),
  })
