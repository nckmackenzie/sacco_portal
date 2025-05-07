import { Link, useLocation } from '@tanstack/react-router'
import {
  BarChart4,
  Bell,
  CreditCard,
  Home,
  LogOut,
  PiggyBank,
  User,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
// import AppLogo from '@/components/custom/logo'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Deposits',
    icon: PiggyBank,
    url: '/deposits',
  },
  {
    title: 'Loans',
    icon: CreditCard,
    url: '/loans',
  },
  {
    title: 'Transactions',
    icon: BarChart4,
    url: '/transactions',
  },
  {
    title: 'Notifications',
    icon: Bell,
    url: '/notifications',
  },
  {
    title: 'Profile',
    icon: User,
    url: '/profile',
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { logout } = useAuth()
  const location = useLocation()
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader className="h-16 flex  justify-center">
        <UserAvatar />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'transition-colors hover:bg-background hover:*:foreground',
                      {
                        'bg-background *:foreground':
                          item.url === location.pathname,
                      },
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {open ? (
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-destructive/50 hover:text-background transition-colors duration-200"
            onClick={() => logout()}
          >
            <LogOut size={20} className="text-destructive" />
            <span className="ml-3">Logout</span>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOut size={20} className="text-destructive" />
            <span className="sr-only">Logout</span>
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function UserAvatar() {
  const { user } = useAuth()
  const { open } = useSidebar()
  if (!user) return null

  const userAvatar = user.member?.photo
    ? `${import.meta.env.VITE_APP_API_URL}/storage/${user.member.photo}`
    : undefined

  return (
    <div className="flex items-center">
      <Avatar className="size-12">
        <AvatarImage src={userAvatar} alt={user.name} />
      </Avatar>
      {open && (
        <div className="ml-2 hidden md:block">
          <p className="text-sm font-medium text-accent-foreground">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-secondary-foreground">
            Member #{user.member?.memberNo}
          </p>
        </div>
      )}
    </div>
  )
}
