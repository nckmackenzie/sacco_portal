import {
  ArrowRightLeftIcon,
  BanknoteIcon,
  CreditCardIcon,
  LandmarkIcon,
} from 'lucide-react'
import type { PaymentMethod } from '@/types/index.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/custom/icons'

export function PaymentMethodBadges({
  method,
}: {
  method?: PaymentMethod | 'transfer_out' | 'transfer_in'
}) {
  if (!method) {
    return null
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200 border-green-200 dark:border-green-800 uppercase',
        {
          'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-800':
            method === 'transfer_out',
        },
      )}
    >
      {method === 'cash' ? (
        <BanknoteIcon className="h-3 w-3 mr-1" />
      ) : method === 'cheque' ? (
        <CreditCardIcon className="h-3 w-3 mr-1" />
      ) : method === 'transfer_in' || method === 'transfer_out' ? (
        <ArrowRightLeftIcon className="h-3 w-3 mr-1" />
      ) : method === 'bank' ? (
        <LandmarkIcon className="h-3 w-3 mr-1" />
      ) : null}
      {method !== 'mpesa' ? (
        method
      ) : (
        <>
          <Icons.Mpesa className="h-3 w-3 -mx-0.5" />
          {/* <span className="text-xs">M</span> */}
          <span className="text-xs">MPESA</span>
        </>
      )}
    </Badge>
  )
}
