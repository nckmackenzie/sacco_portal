import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="light" storageKey="sacco-ui-theme">
        <main className="h-screen">
          <Outlet />
          <Toaster />
        </main>
      </ThemeProvider>
      <TanStackRouterDevtools position="top-left" />
      <TanstackQueryLayout />
    </>
  ),
})
