import { queryOptions } from '@tanstack/react-query'
import type { LoanRequest } from '@/features/requests/utils/requests.types'
import axios from '@/lib/api/axios'
import { fetchErrorHandler } from '@/lib/formatters'

export const pendingRequestOptions = () =>
  queryOptions({
    queryKey: ['pending requests'],
    queryFn: async (): Promise<{
      data: Array<LoanRequest>
    }> => {
      try {
        const { data } = await axios('/api/loan-requests')

        return data
      } catch (error) {
        const err = fetchErrorHandler(error)
        throw new Error(err)
      }
    },
  })
