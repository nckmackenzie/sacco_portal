import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { env } from '@/env'

interface UserAvartarProps {
  className?: string
  userName: string
  userPhoto?: string
}

export default function UserAvartar({
  userName,
  className,
  userPhoto,
}: UserAvartarProps) {
  const userAvatar = userPhoto
    ? `${env.VITE_APP_API_URL}/storage/${userPhoto}`
    : undefined
  return (
    <Avatar className={cn('', className)}>
      <AvatarImage src={userAvatar} alt={userName} />
      <AvatarFallback>{getInitials(userName)}</AvatarFallback>
    </Avatar>
  )
}
