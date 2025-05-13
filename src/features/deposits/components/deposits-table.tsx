import type { ColumnDef } from '@tanstack/react-table'
import type { Deposit } from '@/features/deposits/utils/deposit.types'
import { DataTable } from '@/components/custom/datatable'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { PaymentMethodBadges } from '@/components/custom/payment-method-badges'

interface DepositsTableProps {
  data: Array<Deposit>
}

export function DepositsTable({ data }: DepositsTableProps) {
  const columns: Array<ColumnDef<Deposit>> = [
    {
      accessorKey: 'depositDate',
      header: 'Deposit Date',
      cell: ({ row }) => <div>{formatDate(row.original.depositDate)}</div>,
    },
    {
      accessorKey: 'transactionCode',
      header: 'Transaction Ref',
      cell: ({ row }) => <div>{row.original.transactionCode}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({
        row: {
          original: { amount },
        },
      }) => (
        <div
          className={`font-medium ${amount > 0 ? 'text-success-foreground' : 'text-error-foreground'} `}
        >
          {formatCurrency(amount)}
        </div>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <PaymentMethodBadges method={row.original.paymentMethod ?? undefined} />
      ),
    },
    {
      accessorKey: 'paymentReference',
      header: 'Payment Reference',
      cell: ({ row }) => (
        <div className="uppercase">{row.original.paymentReference}</div>
      ),
    },
  ]
  return <DataTable data={data} columns={columns} />
}
