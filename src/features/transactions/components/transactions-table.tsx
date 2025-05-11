import type { ColumnDef } from '@tanstack/react-table'
import type { MemberTransaction } from '@/features/dashboard/utils/dashboard.types'
import { DataTable } from '@/components/custom/datatable'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function transactionTypeFormatting(transactionType: string) {
  switch (transactionType) {
    case 'deposit':
      return 'Savings Deposit'
    case 'Withdrawal':
      return 'Deposits Withdrawal'
    case 'loan repayment':
      return 'Loan Repayment'
    case 'offset':
      return 'Deposit Offset'
    case 'chequebook':
      return 'Chequebook Issuance'
    case 'passbook':
      return 'Passbook Issuance'
    case 'registration_fee':
      return 'Registration Fee'
    default:
      return transactionType
  }
}

export function TransactionsTable({
  data,
}: {
  data: Array<MemberTransaction>
}) {
  const columns: Array<ColumnDef<MemberTransaction>> = [
    {
      accessorKey: 'txnDate',
      header: 'Date',
      cell: ({ row }) => <div>{formatDate(row.original.txnDate)}</div>,
    },
    {
      accessorKey: 'transactionType',
      header: 'Transaction Type',
      cell: ({ row }) => (
        <div className="capitalize">
          {transactionTypeFormatting(row.original.transactionType)}
        </div>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <div className="capitalize">{row.original.paymentMethod}</div>
      ),
    },
    {
      accessorKey: 'paymentReference',
      header: 'Reference',
      cell: ({ row }) => <div>{row.original.paymentReference}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({
        row: {
          original: { transactionType, amount },
        },
      }) => (
        <div
          className={cn('text-warning-foreground font-medium', {
            'text-success-foreground':
              transactionType === 'deposit' ||
              transactionType === 'share capital',
            'text-error-foreground':
              transactionType === 'offset' || transactionType === 'withdrawal',
          })}
        >
          {formatCurrency(Math.abs(amount))}
        </div>
      ),
    },
  ]
  return <DataTable data={data} columns={columns} />
}
