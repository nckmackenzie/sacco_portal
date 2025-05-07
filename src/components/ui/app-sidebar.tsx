import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
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
} from '@/components/ui/sidebar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
// import AppLogo from '@/components/custom/logo'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'

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
    title: 'Withdrawals',
    icon: ArrowUpRight,
    url: '/withdrawals',
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
  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader className="h-16 flex  justify-center">
        {/* <AppLogo /> */}
        <UserAvatar />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-destructive/50 hover:text-background transition-colors duration-200"
          onClick={() => logout()}
        >
          <LogOut size={20} className="text-destructive" />
          <span className="ml-3">Logout</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function UserAvatar() {
  const { user } = useAuth()
  if (!user) return null

  const userAvatar = user.member?.photo
    ? `${import.meta.env.VITE_APP_API_URL}/storage/${user.member.photo}`
    : undefined

  return (
    <div className="flex items-center">
      {/* <div className="size-12 border border-primary rounded-2xl bg-primary/50 flex items-center justify-center"> */}
      <Avatar className="size-12">
        <AvatarImage src={userAvatar} alt={user.name} />
      </Avatar>
      {/* </div> */}
      <div className="ml-2 hidden md:block">
        <p className="text-sm font-medium text-accent-foreground">
          {user.name || 'User'}
        </p>
        <p className="text-xs text-secondary-foreground">
          Member #{user.member?.memberNo}
        </p>
      </div>
    </div>
  )
}
