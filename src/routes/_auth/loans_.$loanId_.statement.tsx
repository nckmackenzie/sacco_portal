import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DownloadIcon } from 'lucide-react'
import { loanStatementQueryOptions } from '@/features/loans/services/query-options'
import { useDocumentTitle } from '@/hooks/use-title'
import { ErrorComponent } from '@/components/custom/error'
import { Loader } from '@/components/custom/spinner'
import { Button } from '@/components/ui/button'
import { loanRef } from '@/features/loans/components/loan-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/formatters'
import axios from '@/lib/api/axios'
import { env } from '@/env'

export const Route = createFileRoute('/_auth/loans_/$loanId_/statement')({
  pendingComponent: () => <Loader size="lg" />,
  loader: ({ context, params: { loanId } }) =>
    context.queryClient.ensureQueryData(loanStatementQueryOptions(loanId)),
  component: RouteComponent,
  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
})

function RouteComponent() {
  useDocumentTitle('Loan Statement')
  const [downloading, setIsDownloading] = React.useState(false)
  const { loanId } = Route.useParams()
  const {
    data: { data },
  } = useSuspenseQuery(loanStatementQueryOptions(loanId))

  async function downloadStatement() {
    setIsDownloading(true)
    try {
      const response = await axios.post(
        `/api/loans/${loanId}/statement/download`,
      )
      const { downloadUrl, filename } = response.data
      // const fullUrl = new URL(downloadUrl, env.VITE_APP_API_URL).href

      const link = document.createElement('a')
      link.target = '_blank'
      link.href = `${env.VITE_APP_API_URL}${downloadUrl}`
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Statement downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download statement. Please try again later.')
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Statement</h1>
          <p className="text-muted-foreground">
            Detailed information for loan{' '}
            {loanRef(
              data.loan.loanAlias,
              new Date(data.loan.applicationDate),
              data.loan.loanId,
            )}
          </p>
        </div>

        <Button
          variant="export"
          className="w-full sm:w-auto"
          onClick={downloadStatement}
          disabled={downloading}
        >
          <DownloadIcon aria-hidden className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <Table className="border overflow-x-auto">
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead>Payment Date</TableHead>
            <TableHead>Payment Reference</TableHead>
            <TableHead className="text-right">Principal</TableHead>
            <TableHead className="text-right">Interest</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.payments.map(
            ({
              id,
              paymentDate,
              paymentReference,
              principalAmount,
              balance,
              interestAmount,
            }) => (
              <TableRow key={id}>
                <TableCell>{formatDate(paymentDate)}</TableCell>
                <TableCell>{paymentReference.toUpperCase()}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(principalAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(interestAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(balance)}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  )
}
