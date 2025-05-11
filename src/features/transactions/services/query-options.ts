import { queryOptions } from '@tanstack/react-query'
import { fetchAllTransactions } from '@/features/transactions/services/api'

export const allTransactionsQueryOptions = (query?: string) =>
  queryOptions({
    queryKey: ['transactions', query],
    queryFn: () => fetchAllTransactions(query),
  })
