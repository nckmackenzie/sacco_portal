import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, differenceInMonths, parseISO } from 'date-fns'
import type { ClassValue } from 'clsx'

interface PaymentResult {
  totalPrincipal: number
  totalInterest: number
  monthsOverdue: number
  isOverdue: boolean
}

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function generateUniqueString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function interestCalculator(
  repaymentPeriod: number,
  loanAmount: number,
) {
  const preInterest = loanAmount * ((repaymentPeriod + 1) / 200)
  const interest = preInterest / repaymentPeriod
  return parseFloat(interest.toString()).toFixed(2)
}

export function calculatePayment(
  nextDueDate: string | Date,
  monthlyPrincipal: number,
  monthlyInterest: number,
): PaymentResult {
  const dueDate =
    typeof nextDueDate === 'string' ? parseISO(nextDueDate) : nextDueDate
  const today = new Date()
  let monthsOverdue = 0

  if (today > dueDate) {
    monthsOverdue = differenceInMonths(today, dueDate)

    if (differenceInDays(today, dueDate) > 7 && monthsOverdue === 0) {
      monthsOverdue = 1
    }
  }

  const totalPrincipal = monthlyPrincipal * (monthsOverdue + 1)
  const totalInterest = monthlyInterest * (monthsOverdue + 1)

  return {
    totalPrincipal: parseFloat(totalPrincipal.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    monthsOverdue,
    isOverdue: monthsOverdue > 0,
  }
}
