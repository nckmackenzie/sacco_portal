import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'

import * as TanstackQuery from './integrations/tanstack-query/root-provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts'

import './styles.css'
import NotFound from '@/components/custom/not-found.tsx'
import { FullPageLoader } from '@/components/custom/spinner.tsx'

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
  },
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultNotFoundComponent: () => <NotFound />,
  defaultPendingComponent: () => (
    <FullPageLoader message="Fetching your data..." />
  ),
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanstackQuery.Provider>
        <RouterProvider router={router} />
      </TanstackQuery.Provider>
    </StrictMode>,
  )
}
