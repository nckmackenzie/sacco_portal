import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { DownloadCloud } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/use-title'
import Search from '@/components/custom/search'
import { Button } from '@/components/ui/button'
import { allTransactionsQueryOptions } from '@/features/transactions/services/query-options'
import {
  TransactionsTable,
  transactionTypeFormatting,
} from '@/features/transactions/components/transactions-table'
import { useExportCsv } from '@/hooks/use-csv'
import { formatCurrency, formatDate } from '@/lib/formatters'

const transactionSearchSchema = z.object({
  q: z.string().optional(),
  transactionType: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

export const Route = createFileRoute('/_auth/transactions')({
  component: RouteComponent,
  validateSearch: transactionSearchSchema,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ context, deps: { q } }) =>
    context.queryClient.ensureQueryData(allTransactionsQueryOptions(q)),
})

function RouteComponent() {
  useDocumentTitle('Transactions')
  const { q } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const {
    data: { data },
  } = useSuspenseQuery(allTransactionsQueryOptions(q))
  const exportToExcel = useExportCsv('transactions')

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            View and track all your transactions.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            exportToExcel(
              data.map(
                ({
                  txnDate,
                  amount,
                  paymentMethod,
                  paymentReference,
                  transactionType,
                }) => ({
                  Date: formatDate(txnDate),
                  'Transaction Type':
                    transactionTypeFormatting(transactionType),
                  'Payment Method': paymentMethod,
                  Reference: paymentReference?.toUpperCase(),
                  Amount: formatCurrency(Math.abs(amount)),
                }),
              ),
            )
          }
        >
          <DownloadCloud className="icon-muted" />
          <span>Export</span>
        </Button>
      </header>
      <Search
        defaultValue={q}
        className="w-full"
        placeholder="Search transactions"
        onHandleSearch={(term: string) => {
          navigate({
            search: (prev) => ({
              ...prev,
              q: term.trim().length > 0 ? term : undefined,
            }),
          })
        }}
      />
      <TransactionsTable data={data} />
    </div>
  )
}
