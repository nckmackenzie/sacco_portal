import { queryOptions } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { User } from '@/types/index.types'
import axios from '@/lib/api/axios'

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ['auth-user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const { data } = await axios('/api/user')
        return data
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return null
        }
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
