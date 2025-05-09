import { Link } from '@tanstack/react-router'
import {
  BanknoteIcon,
  BarChart3Icon,
  MoveRightIcon,
  PiggyBankIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MemberStats } from '@/features/dashboard/utils/dashboard.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/formatters'

export function DashboardStats({ data }: { data: MemberStats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Deposits"
        value={`${formatCurrency(data.deposits)}`}
        description="Your total savings."
        icon={PiggyBankIcon}
        className="from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-900"
        valueColor="text-emerald-500 dark:text-emerald-400"
      />
      <OverviewCard
        title="Share Capital"
        value={`${formatCurrency(data.shareCapital)}`}
        description="Your ownership stake."
        icon={BarChart3Icon}
        className="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-900"
        valueColor="text-blue-500 dark:text-blue-400"
      />
      <OverviewCard
        title="Loan Balance"
        value={`${formatCurrency(data.totalLoanBalance)}`}
        description="Outstanding loan balance."
        icon={BanknoteIcon}
        className="from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/20 border border-rose-200 dark:border-rose-900"
        valueColor="text-rose-500 dark:text-rose-400"
      />
      <OverviewCard
        title="Loans Guaranteed"
        value={data.loansGuaranteed.toString()}
        description="No of loans guaranteed."
        icon={TriangleAlertIcon}
        className="from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-900"
        valueColor="text-amber-500 dark:text-amber-400"
      />
    </div>
  )
}

interface OverviewCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  valueColor?: string
}

export function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  valueColor,
}: OverviewCardProps) {
  return (
    <Card className={cn('shadow-none bg-gradient-to-br', className)}>
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold capitalize', valueColor)}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && trendValue && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={
                trend === 'up'
                  ? 'text-emerald-500'
                  : trend === 'down'
                    ? 'text-rose-500'
                    : 'text-slate-500'
              }
            >
              {trendValue}
            </span>
            <span className="ml-1 text-muted-foreground">from last month</span>
          </div>
        )}
        <Link
          to="/dashboard"
          className="text-link hover:text-link/80 mt-4 inline-flex items-center gap-2 text-xs font-semibold"
        >
          <span>View Details</span>
          <MoveRightIcon size={16} />
        </Link>
      </CardContent>
    </Card>
  )
}
