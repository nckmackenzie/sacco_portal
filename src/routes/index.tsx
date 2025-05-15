import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import AppLogo from '@/components/custom/logo'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isLoading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/login',

        replace: true,
      })
    } else if (isAuthenticated && !isLoading) {
      navigate({
        to: '/dashboard',
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className="text-center h-full flex flex-col items-center justify-center gap-4">
      <AppLogo />
      <h1 className="text-2xl font-bold">Welcome to the Member&apos; Portal</h1>
      <p className="text-sm text-muted-foreground">
        Please wait while we redirect you...
      </p>
    </div>
  )
}
