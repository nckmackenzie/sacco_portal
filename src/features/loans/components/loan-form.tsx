import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { UseFormReturn } from 'react-hook-form'
import type { LoanApplicationFormValues } from '@/features/loans/utils/loans.type'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { loanTypesQueryOptions } from '@/features/loans/services/query-options'
import BasicSelect from '@/components/custom/custom-select'
import { Input } from '@/components/ui/input'

const route = getRouteApi('/_auth/loans_/new')

const LOAN_PURPOSE = [
  { value: 'personal development', label: 'Personal Development' },
  { value: 'business', label: 'Business' },
  { value: 'medical expenses', label: 'Medical expense' },
  { value: 'education', label: 'Education/Fees' },
  { value: 'other', label: 'Other' },
]
export default function Information({
  form,
}: {
  form: UseFormReturn<LoanApplicationFormValues>
}) {
  const [loanTypes, memberLoanStatus] = route.useLoaderData()
  const { data } = useQuery(loanTypesQueryOptions())

  const loanTypeOptions = (data?.data || loanTypes.data)
    .filter(({ isActive }) => isActive)
    .map(({ id, name }) => ({
      value: id,
      label: name.toUpperCase(),
    }))

  useEffect(function () {
    form.setValue('loanLimit', memberLoanStatus.data.loanLimit)
  }, [])

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="loanType"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Loan Type</FormLabel>
            <BasicSelect
              options={loanTypeOptions}
              defaultValue={field.value}
              onChange={(value) => {
                field.onChange(value)
                if (value) {
                  const maximumRepayment =
                    data?.data.find((item) => item.id === value)
                      ?.maximumRepayment || 24
                  form.setValue('maximumRepaymentPeriod', maximumRepayment)
                  form.setValue('repaymentPeriod', maximumRepayment)
                }
              }}
              value={field.value}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="loanAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Amount</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value)
                  if (value) {
                    const deposits = memberLoanStatus.data.deposits
                    const loanBalance = memberLoanStatus.data.totalLoanBalance
                    const remainingBalance = deposits - loanBalance
                    if (Number(value) > remainingBalance) {
                      form.setValue('canSelfGuarantee', false)
                    } else {
                      form.setValue('canSelfGuarantee', true)
                    }
                  }
                }}
                placeholder="Enter amount..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Purpose Of Loan</FormLabel>
            <BasicSelect
              options={LOAN_PURPOSE}
              defaultValue={field.value}
              onChange={field.onChange}
              value={field.value}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="repaymentPeriod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repayment Period(In Months)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                placeholder="Enter repayment period"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
