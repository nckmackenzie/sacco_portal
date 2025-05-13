'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateRange | undefined
  onChange?: (date: DateRange | undefined) => void
  placeholder?: string
  dateFormat?: string
  numberOfMonths?: 1 | 2
  allowPastDates?: boolean
  buttonVariant?: 'default' | 'outline' | 'ghost'
  buttonClassName?: string
  disabled?: boolean
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = 'Select date range',
  dateFormat = 'MMM dd, yyyy',
  numberOfMonths = 2,
  allowPastDates = true,
  buttonVariant = 'outline',
  buttonClassName,
  disabled = false,
  ...props
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)

    if (onChange) {
      onChange(selectedDate)
    }
  }

  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={buttonVariant}
            disabled={disabled}
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              buttonClassName,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, dateFormat)} -{' '}
                  {format(date.to, dateFormat)}
                </>
              ) : (
                format(date.from, dateFormat)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
