import { queryClient } from '@/integrations/tanstack-query/root-provider'
import axios from '@/lib/api/axios'
import { fetchErrorHandler } from '@/lib/formatters'

export async function markNotificationAsRead(id: string) {
  try {
    await axios.patch(`/api/notifications/${id}`)
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  } catch (error) {
    const err = fetchErrorHandler(error)
    throw new Error(err)
  }
}
export async function markAllNotificationsAsRead() {
  try {
    await axios.patch('/api/notifications/read')
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  } catch (error) {
    const err = fetchErrorHandler(error)
    throw new Error(err)
  }
}
