import { Link } from '@tanstack/react-router'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CreditCard,
  Percent,
  TrendingUp,
} from 'lucide-react'
import type { MemberTransaction } from '@/features/dashboard/utils/dashboard.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function RecentTransactions({
  data,
}: {
  data: Array<MemberTransaction>
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between ">
        <div>
          <CardTitle className="text-lg font-semibold ">
            Recent Transactions
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your recent account activity
          </CardDescription>
        </div>
        <Link to="/transactions" className="text-link text-xs font-semibold">
          View All
        </Link>
        {/* <MoveRightIcon className="h-4 w-4 text-muted-foreground" aria-hidden /> */}
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          data.map((d) => <TransactionItem key={d.id} transaction={d} />)
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            No recent transactions available.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function TransactionItem({ transaction }: { transaction: MemberTransaction }) {
  const isPositive = ['deposit', 'share capital', 'dividend'].includes(
    transaction.transactionType.toLowerCase(),
  )
  return (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-0">
      <div className="mr-3">
        <TransactionTypeIcon transactionType={transaction.transactionType} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium capitalize">
          {transaction.transactionType}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(transaction.txnDate)}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <p
          className={cn('text-sm font-medium text-warning-foreground', {
            'text-success-foreground': isPositive,
            'text-error-foreground':
              transaction.transactionType === 'withdrawal' ||
              transaction.transactionType === 'offset',
          })}
        >
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  )
}

export function TransactionTypeIcon({
  transactionType,
}: {
  transactionType: MemberTransaction['transactionType']
}) {
  switch (transactionType) {
    case 'deposit':
      return (
        <div className="rounded-full p-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-100">
          <ArrowDownLeft size={16} />
        </div>
      )
    case 'withdrawal':
      return (
        <div className="rounded-full p-2 bg-amber-100 text-amber-700">
          <ArrowUpRight size={16} />
        </div>
      )
    case 'loan repayment':
      return (
        <div className="rounded-full p-2 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-100">
          <CreditCard size={16} />
        </div>
      )
    case 'share capital':
      return (
        <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
          <Percent size={16} />
        </div>
      )
    case 'dividend':
      return (
        <div className="rounded-full p-2 bg-purple-100 text-purple-700">
          <TrendingUp size={16} />
        </div>
      )
    default:
      return (
        <div className="rounded-full p-2 bg-gray-100 text-gray-700">
          <Banknote size={16} />
        </div>
      )
  }
}
