import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useDocumentTitle } from '@/hooks/use-title'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Dashboard')
  const { logout } = useAuth()
  return (
    <div>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  )
}
