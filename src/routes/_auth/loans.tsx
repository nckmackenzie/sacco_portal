import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useSuspenseQueries } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-title'
import { Loader } from '@/components/custom/spinner'
import { ErrorComponent } from '@/components/custom/error'
import { optionalStringSchemaEntry } from '@/lib/schema-entries'
import {
  loanTypesQueryOptions,
  loansQueryOptions,
} from '@/features/loans/services/query-options'
import Search from '@/components/custom/search'
import LoanTable from '@/features/loans/components/loan-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import LoansMobileView from '@/features/loans/components/loans-mobile-view'

const loanSearchSchema = z.object({
  q: optionalStringSchemaEntry(),
  status: z
    .enum(['all', 'pending', 'active', 'completed', 'rejected'])
    .optional(),
  loanType: optionalStringSchemaEntry(),
})

export type LoanStatus = z.infer<typeof loanSearchSchema>['status']

export const Route = createFileRoute('/_auth/loans')({
  component: RouteComponent,
  pendingComponent: () => <Loader size="lg" />,
  validateSearch: loanSearchSchema,
  loaderDeps: ({ search: { q, loanType, status } }) => ({
    q,
    loanType,
    status,
  }),
  loader: ({ context, deps: { q, loanType, status } }) =>
    Promise.all([
      context.queryClient.ensureQueryData(loanTypesQueryOptions()),
      context.queryClient.ensureQueryData(
        loansQueryOptions(q, status, loanType),
      ),
    ]),

  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
})

function RouteComponent() {
  useDocumentTitle('Loans')
  const { q, loanType, status } = Route.useSearch()
  const isMobile = useIsMobile()
  const [loanTypes, loans] = useSuspenseQueries({
    queries: [loanTypesQueryOptions(), loansQueryOptions(q, status, loanType)],
  })
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
      <Filters loanTypes={loanTypes.data.data} />
      {isMobile ? (
        <LoansMobileView loans={loans.data.data} />
      ) : (
        <LoanTable data={loans.data.data} />
      )}
    </div>
  )
}

function Filters({
  loanTypes,
}: {
  loanTypes: Array<{ id: string; name: string }>
}) {
  const navigate = useNavigate({ from: Route.fullPath })
  const { q, loanType, status } = Route.useSearch()
  return (
    <>
      <Search
        defaultValue={q}
        parentClassName="w-full md:w-1/2 lg:w-1/3"
        className="w-full"
        placeholder="Search loans..."
        onHandleSearch={(term: string) => {
          navigate({
            search: (prev) => ({
              ...prev,
              q: term.trim().length > 0 ? `${term.toString()}` : undefined,
            }),
          })
        }}
      />
      <div className="flex gap-2 md:hidden">
        <Select
          defaultValue={status || 'all'}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({ ...prev, status: value as LoanStatus }),
            })
          }
        >
          <SelectTrigger className="text-xs flex-1 shadow-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={loanType || 'all'}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({ ...prev, loanType: value }),
            })
          }
        >
          <SelectTrigger className="text-xs flex-1 shadow-none">
            <SelectValue placeholder="Loan Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {loanTypes.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
