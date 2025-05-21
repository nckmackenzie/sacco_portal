import { queryOptions } from '@tanstack/react-query'
import type { Notification, Pagination } from '@/types/index.types'
import { fetchErrorHandler } from '@/lib/formatters'
import axios from '@/lib/api/axios'

export const notificationsOptions = () =>
  queryOptions({
    queryKey: ['notifications'],
    queryFn: async (): Promise<{
      data: Array<Notification>
      unread: number
      pagination: Pagination
    }> => {
      try {
        const { data } = await axios('/api/notifications')

        return data
      } catch (error) {
        const err = fetchErrorHandler(error)
        throw new Error(err)
      }
    },
  })
