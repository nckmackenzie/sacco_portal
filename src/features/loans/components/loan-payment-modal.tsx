import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoIcon } from 'lucide-react'
import type { LoanPaymentFormValues } from '@/features/loans/utils/loans.type'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/custom/credenza'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loanPaymentFormSchema } from '@/features/loans/utils/loan-schema'
import { Label } from '@/components/ui/label'
import { calculatePayment } from '@/lib/utils'
import { formatCurrency } from '@/lib/formatters'
import { env } from '@/env'

export interface LoanPaymentModalProps {
  loanId: string
  monthlyPayment: number
  loanInterest: number
  nextDueDate: string | Date
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanPaymentModal({
  isOpen,
  loanId,
  loanInterest,
  nextDueDate,
  monthlyPayment,
  onOpenChange,
}: LoanPaymentModalProps) {
  const payment = calculatePayment(
    nextDueDate,
    monthlyPayment,
    parseFloat(loanInterest.toString()),
  )
  const form = useForm<LoanPaymentFormValues>({
    defaultValues: {
      loanId,
      insurance: 0,
      penaltyAmount: payment.monthsOverdue * 1000,
      paymentMethod: 'mpesa',
      interestAmount: payment.totalInterest,
      principalAmount: payment.totalPrincipal,
    },
    resolver: zodResolver(loanPaymentFormSchema),
  })
  const [interestAmount, principalAmount, penaltyAmount] = useWatch({
    control: form.control,
    name: ['interestAmount', 'principalAmount', 'penaltyAmount'],
  })
  const totalPayable =
    parseFloat(interestAmount?.toString() || '0') +
    parseFloat(principalAmount.toString()) +
    parseFloat(penaltyAmount?.toString() || '0')

  return (
    <Credenza open={isOpen} onOpenChange={onOpenChange}>
      <CredenzaContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => {
              console.log(data)
            })}
          >
            <CredenzaHeader>
              <CredenzaTitle>Loan Payment</CredenzaTitle>
              <CredenzaDescription className="text-xs text-muted-foreground">
                Enter required fields and click submit. Enter MPESA pin when
                prompted to complete the transaction.
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody className="space-y-4">
              {env.VITE_APP_ALLOW_MPESA === 'false' && (
                <div className="rounded-md bg-warning p-4  text-warning-foreground flex gap-2">
                  <InfoIcon size={24} className="shrink-0" />
                  <span className="text-sm">
                    <strong>Important: For Testing Purposes Only</strong>.MPESA
                    not integrated in this environment.
                  </span>
                </div>
              )}
              <FormField
                control={form.control}
                name="principalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Principal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        placeholder="0.00"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        placeholder="0.00"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="penaltyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penalty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        placeholder="0.00"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Total</Label>
                <Input value={formatCurrency(totalPayable)} />
              </div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount<sup className="text-destructive">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CredenzaBody>
            <CredenzaFooter className="flex flex-row items-center justify-end">
              <Button>Submit</Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  )
}
