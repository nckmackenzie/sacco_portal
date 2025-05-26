import { useEffect } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Bell, MoonIcon, SunIcon } from 'lucide-react'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/theme-provider'
import { notificationsOptions } from '@/services/query-options'

// const getPageTitle = (location: string) => {
//   switch (location) {
//     case '/dashboard':
//       return 'Dashboard'
//     case '/deposits':
//       return 'Deposits'
//     case '/loans':
//       return 'Loans'
//     case '/withdrawals':
//       return 'Withdrawals'
//     case '/transactions':
//       return 'Transactions'
//     case '/notifications':
//       return 'Notifications'
//     case '/profile':
//       return 'Profile'
//     default:
//       return 'Dashboard'
//   }
// }

export const Route = createFileRoute('/_auth')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(notificationsOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useAuth()

  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/login',

        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4 md:px-6">
          <div className="flex items-center gap-2 ">
            <SidebarTrigger className="-ml-1 block md:hidden" />

            {/* <h2>{getPageTitle(slocation.pathname)}</h2> */}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <MoonIcon className="h-4 w-4" />
              ) : (
                <SunIcon className="h-4 w-4" />
              )}
            </Button>
            <Notifications />
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 md:p-6 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function Notifications() {
  const { data } = useQuery(notificationsOptions())
  return (
    <div
      className={cn(
        buttonVariants({ variant: 'outline', size: 'icon' }),
        'relative',
      )}
      role="button"
    >
      <Link to="/notifications" className="text-gray-500 hover:text-gray-700">
        <Bell size={20} />
        {data?.unread && data.unread > 0 ? (
          <span className="absolute -top-1/2 translate-y-1/2 right-0 h-4 w-4 bg-rose-400 dark:bg-rose-600 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
            {data.unread < 10 ? data.unread : `9+`}
          </span>
        ) : null}
      </Link>
    </div>
  )
}
