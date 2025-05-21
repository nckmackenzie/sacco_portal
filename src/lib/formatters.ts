import { isAxiosError } from 'axios'
import type { UseFormSetError } from 'react-hook-form'
import type { DashboardLoan } from '@/features/dashboard/utils/dashboard.types'
import { router } from '@/main'

export const flattenErrors = (error: Record<string, Array<string>>) => {
  return Object.values(error).flat()
}

export function errorHandler(error: unknown) {
  if (isAxiosError(error)) {
    let errors = ''
    if (error.status === 422) {
      errors = flattenErrors(error.response?.data.errors).join('\n')
    } else if (error.status === 404) {
      throw new Error('Could not find the requested resource.')
    } else if (error.status === 302) {
      throw new Error(error.response?.data.message)
    } else if (error.status === 401) {
      router.navigate({ to: '/login', replace: true })
    } else {
      errors = error.response?.data.error
    }
    throw new Error(errors || 'An error occurred while performing this action.')
  } else {
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred.')
  }
}

export function fetchErrorHandler(error: unknown) {
  if (isAxiosError(error)) {
    if (error.status === 404) {
      return 'Could not find the requested resource.'
    } else if (error.status === 401) {
      router.navigate({ to: '/login', replace: true })
    } else {
      return (
        error.response?.data.error ||
        error.response?.data.message ||
        'An error occurred while performing this action.'
      )
    }
  } else {
    if (error instanceof Error) {
      return error.message
    }
    return 'An unexpected error occurred.'
  }
}

export function getInitials(name: string) {
  const names = name.split(' ')
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function formatDateToYMD(date: string | Date): string {
  const d = new Date(date)

  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

  return `${year}-${month}-${day}`
}

interface ApiErrors {
  [key: string]: string
}

export const handleApiErrors = <T extends Record<string, any>>(
  errors: ApiErrors,
  setError: UseFormSetError<T>,
) => {
  Object.keys(errors).forEach((field) => {
    setError(field as any, {
      type: 'manual',
      message: errors[field],
    })
  })
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'kes',
    currencyDisplay: 'narrowSymbol',
  }).format(value)
}

export function getLoanStatus(
  loanStatus: DashboardLoan['loanStatus'],
  completedAt: Date | null,
  nextDueDate: Date | null,
  balance: number,
  writtenOff: boolean,
) {
  if (completedAt || loanStatus === 'repaid' || balance < 0) {
    return 'completed'
  } else if (nextDueDate && nextDueDate < new Date()) {
    return 'overdue'
  } else if (loanStatus === 'approved' && balance > 0 && !writtenOff) {
    return 'active'
  } else if (loanStatus === 'pending') {
    return 'pending'
  } else if (loanStatus === 'rejected') {
    return 'rejected'
  } else if (writtenOff) {
    return 'written-off'
  } else {
    return 'unknown'
  }
}
