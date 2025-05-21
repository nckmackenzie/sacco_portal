import { useFieldArray } from 'react-hook-form'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import clsx from 'clsx'
import { isAxiosError } from 'axios'
import type { AxiosResponse } from 'axios'
import type { UseFormReturn } from 'react-hook-form'
import type { LoanApplicationFormValues } from '@/features/loans/utils/loans.type'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { generateUniqueString } from '@/lib/utils'
import axios from '@/lib/api/axios'

interface GuarantorFormProps {
  form: UseFormReturn<LoanApplicationFormValues>
  canSelfGuarantee: boolean
  isFullyGuaranteed: boolean
  totalGuaranteedAmount: number
  amountRequiredForGuarantee: number
  loanAmount: number
}

interface PhoneNumberValidationResponse {
  success: boolean
  error: string | null
  memberId: string | null
  name: string | null
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 422) {
      return error.response.data.errors.contact
    }
    return error.response?.data?.error || 'Cannot validate phone number!'
  }
  return error instanceof Error
    ? error.message
    : 'Cannot validate phone number!'
}

const validatePhoneNumber = (value: string) => {
  if (!value) return false
  return value.startsWith('0') && value.length === 10
}

export function GuarantorForm({
  form,
  canSelfGuarantee,
  isFullyGuaranteed,
  totalGuaranteedAmount,
  amountRequiredForGuarantee,
  loanAmount,
}: GuarantorFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'guarantors',
  })

  return (
    <div className="space-y-4">
      {!canSelfGuarantee && (
        <Alert
          className={clsx({
            'bg-warning text-warning-foreground': !isFullyGuaranteed,
            'bg-success text-success-foreground': isFullyGuaranteed,
          })}
        >
          <AlertDescription className="text-xs">
            {isFullyGuaranteed
              ? `Your loan is fully guaranteed (${totalGuaranteedAmount.toLocaleString()} Ksh)`
              : `Your loan requires additional guarantors. Currently guaranteed: ${totalGuaranteedAmount.toLocaleString()} Ksh of ${amountRequiredForGuarantee.toLocaleString()} Ksh (${
                  loanAmount > 0
                    ? Math.round(
                        (totalGuaranteedAmount / amountRequiredForGuarantee) *
                          100,
                      )
                    : 0
                }%)`}
          </AlertDescription>
        </Alert>
      )}
      {fields.map((item, index) => (
        <GuarantorCard
          key={item.id}
          index={index}
          form={form}
          onRemove={remove}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            amountGuaranteed: 0,
            guarantorName: '',
            guarantorContact: '',
            guarantorId: '',
            id: generateUniqueString(10),
          })
        }
        className="flex w-full items-center justify-center"
      >
        <PlusIcon aria-hidden className="mr-2 h-4 w-4" />
        Add {fields.length > 0 ? 'Another' : ''} Guarantor
      </Button>
    </div>
  )
}

interface GuarantorCardProps {
  index: number
  form: UseFormReturn<LoanApplicationFormValues>
  onRemove: (index: number) => void
}

function GuarantorCard({ index, form, onRemove }: GuarantorCardProps) {
  async function handleValidatePhoneNumber(phoneNumber: string, i: number) {
    try {
      const results: AxiosResponse<PhoneNumberValidationResponse> = await axios(
        `/api/members/by-contact?contact=${phoneNumber}`,
      )

      if (results.data.success) {
        form.setValue(
          `guarantors.${i}.guarantorId`,
          results.data.memberId as string,
        )
        form.setValue(
          `guarantors.${i}.guarantorName`,
          results.data.name as string,
        )
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      form.setError(`guarantors.${i}.guarantorContact`, {
        message: errorMessage,
      })
      form.setValue(`guarantors.${i}.amountGuaranteed`, 0)
    }
  }

  return (
    <Card className="shadow-none ">
      <CardContent className="space-y-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Guarantor {index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon aria-hidden className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`guarantors.${index}.guarantorName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guarantee Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`guarantors.${index}.guarantorContact`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guarantee Phone No</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number..."
                    {...field}
                    onBlur={(e) => {
                      const value = e.target.value
                      if (!validatePhoneNumber(value)) return
                      handleValidatePhoneNumber(value, index)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={`guarantors.${index}.amountGuaranteed`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guarantee Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
