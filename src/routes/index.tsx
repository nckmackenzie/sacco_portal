import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import logo from '../logo.svg'
import { useAuth } from '@/hooks/use-auth'

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
    } else if (isAuthenticated) {
      navigate({
        to: '/dashboard',
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className="text-center">
      <img
        src={logo}
        className="animate-spin-slow h-32 w-32 mx-auto"
        alt="logo"
      />
      <h1 className="text-2xl font-bold">Welcome to the Member&apos; Portal</h1>
      <p className="text-sm text-muted-foreground">
        Please wait while we redirect you...
      </p>
    </div>
  )
}
