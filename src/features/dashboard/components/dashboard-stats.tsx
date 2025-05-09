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
        className="bg-emerald-200/20 dark:bg-emerald-900 border-transparent"
        valueColor="text-emerald-500 dark:text-emerald-400"
      />
      <OverviewCard
        title="Share Capital"
        value={`${formatCurrency(data.shareCapital)}`}
        description="Your ownership stake."
        icon={BarChart3Icon}
        className="bg-blue-200/20 dark:bg-blue-900 border-transparent"
        valueColor="text-blue-500 dark:text-blue-400"
      />
      <OverviewCard
        title="Loan Balance"
        value={`${formatCurrency(data.totalLoanBalance)}`}
        description="Outstanding loan balance."
        icon={BanknoteIcon}
        className="bg-rose-200/20 dark:bg-rose-900 border-transparent"
        valueColor="text-rose-500 dark:text-rose-400"
      />
      <OverviewCard
        title="Loans Guaranteed"
        value={data.loansGuaranteed.toString()}
        description="No of loans guaranteed."
        icon={TriangleAlertIcon}
        className="bg-amber-200/20 dark:bg-amber-900 border-transparent"
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
    <Card className={cn('shadow-none', className)}>
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', valueColor)}>{value}</div>
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
