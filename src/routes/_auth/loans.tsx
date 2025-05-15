import { Link, createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-title'

export const Route = createFileRoute('/_auth/loans')({
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Loans')
  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-4">
        <div>
          <h1 className="text-2xl font-bold">Loans</h1>
          <p className="text-sm text-muted-foreground">
            View and track all your loans.
          </p>
        </div>
        <Button asChild>
          <Link to="/loans/new">
            <PlusIcon className="icon" />
            <span>Apply for a loan</span>
          </Link>
        </Button>
      </header>
    </div>
  )
}
