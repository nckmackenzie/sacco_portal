import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { CheckCheckIcon, ClockIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import { toast } from 'sonner'
import type { Notification as NotificationType } from '@/types/index.types'
import { ErrorComponent } from '@/components/custom/error'
import { useDocumentTitle } from '@/hooks/use-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { notificationsOptions } from '@/services/query-options'
import { markNotificationAsRead } from '@/services/api'
import axios from '@/lib/api/axios'

export const Route = createFileRoute('/_auth/notifications')({
  component: RouteComponent,

  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
})

function RouteComponent() {
  useDocumentTitle('Notifications')
  const queryClient = useQueryClient()
  const {
    data: { data, unread },
  } = useSuspenseQuery(notificationsOptions())

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await axios.patch('/api/notifications/mark-read')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => toast.error(err.message),
  })

  return (
    <Card className="max-w-2xl mx-auto w-full shadow-none pb-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base md:text-lg font-medium">
          Notifications
        </CardTitle>
        {unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => mutate()}
          >
            <CheckCheckIcon aria-hidden className="icon" />
            <span className="text-sm underline">Mark all as read</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0">
        {data.map((n) => (
          <Notification key={n.id} notification={n} isPending={isPending} />
        ))}
      </CardContent>
    </Card>
  )
}

function Notification({
  notification,
  isPending,
}: {
  notification: NotificationType
  isPending: boolean
}) {
  const { createdAt, id, isRead, message, path, title } = notification
  const navigate = useNavigate()

  async function handleClick() {
    if (isPending) return
    navigate({ to: path })
    if (isRead) return
    await markNotificationAsRead(id)
  }

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'cursor-pointer flex flex-col md:flex-row md:items-center gap-2 py-4 px-6 first:border-t border-t-0 last:border-b-0 border-b hover:bg-accent-foreground/10 transition-colors duration-200 ease-in-out',
        {
          'opacity-50 pointer-events-none cursor-not-allowed': isPending,
        },
      )}
    >
      <div className="flex flex-col">
        <h3 className="text-sm font-medium capitalize">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      <div className="flex items-center gap-2 md:ml-auto">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground ">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {!isRead && (
          <span className="ml-auto h-2 w-2 bg-primary/45 rounded-full"></span>
        )}
      </div>
    </div>
  )
}
