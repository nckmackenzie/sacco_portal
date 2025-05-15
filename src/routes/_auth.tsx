import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
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

const getPageTitle = (location: string) => {
  switch (location) {
    case '/dashboard':
      return 'Dashboard'
    case '/deposits':
      return 'Deposits'
    case '/loans':
      return 'Loans'
    case '/withdrawals':
      return 'Withdrawals'
    case '/transactions':
      return 'Transactions'
    case '/notifications':
      return 'Notifications'
    case '/profile':
      return 'Profile'
    default:
      return 'Dashboard'
  }
}

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useAuth()
  const slocation = useLocation()
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

            <h2>{getPageTitle(slocation.pathname)}</h2>
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
            <div
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'relative',
              )}
              role="button"
            >
              <Link
                to="/notifications"
                className="text-gray-500 hover:text-gray-700"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Link>
            </div>
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 md:p-6 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
