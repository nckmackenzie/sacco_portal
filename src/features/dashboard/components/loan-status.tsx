import {
  BanIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  CaptionsOffIcon,
  CheckCircleIcon,
  CircleXIcon,
  HourglassIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { getLoanStatus } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'

export function LoanStatus({
  status,
}: {
  status: ReturnType<typeof getLoanStatus>
}) {
  if (status === 'completed')
    return <CustomStatusBadge variant="success" text="Completed" />

  return (
    <Badge
      className="inline-flex gap-1 px-0.5 capitalize"
      variant={
        status === 'active'
          ? 'info'
          : status === 'overdue'
            ? 'error'
            : status === 'pending'
              ? 'info'
              : status === 'written-off'
                ? 'secondary'
                : status === 'rejected'
                  ? 'warning'
                  : 'default'
      }
    >
      {status === 'pending' ? (
        <HourglassIcon size={14} />
      ) : status === 'active' ? (
        <CalendarCheckIcon size={14} />
      ) : status === 'overdue' ? (
        <CalendarXIcon size={14} />
      ) : status === 'written-off' ? (
        <CaptionsOffIcon size={14} />
      ) : status === 'rejected' ? (
        <BanIcon size={14} />
      ) : null}
      {status === 'pending' ? 'Pending Approval' : status}
    </Badge>
  )
}

interface CustomStatusBadgeProps {
  text: string
  variant: 'success' | 'warning' | 'error'
}

function CustomStatusBadge({ text, variant }: CustomStatusBadgeProps) {
  return (
    <Badge variant={variant} className="inline-flex gap-1 px-0.5 capitalize">
      {variant === 'success' ? (
        <CheckCircleIcon size={14} />
      ) : variant === 'error' ? (
        <CircleXIcon size={14} />
      ) : (
        <TriangleAlertIcon size={14} />
      )}
      <span>{text}</span>
    </Badge>
  )
}
