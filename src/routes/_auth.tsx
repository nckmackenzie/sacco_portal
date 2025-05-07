import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Separator } from '@/components/ui/separator'

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
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        <header className="flex h-16 shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 block md:hidden" />
            <Separator orientation="vertical" className="h-4 mr-2" />
            <h2>{getPageTitle(slocation.pathname)}</h2>
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
