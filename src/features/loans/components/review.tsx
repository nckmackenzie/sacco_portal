/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CheckCircle2Icon } from 'lucide-react'
import { useFieldArray, useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import type { LoanApplicationFormValues } from '@/features/loans/utils/loans.type'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function Review({
  form,
  loanType,
}: {
  form: UseFormReturn<LoanApplicationFormValues>
  loanType?: string
}) {
  const [loanAmount, purpose, repaymentPeriod] = useWatch({
    control: form.control,
    name: ['loanAmount', 'purpose', 'repaymentPeriod'],
  })
  const { fields: guarantors } = useFieldArray({
    control: form.control,
    name: 'guarantors',
  })
  return (
    <div className="space-y-6">
      <div className="rounded-md bg-green-50 p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle2Icon className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Application Ready for Submission
            </h3>
            <div className="mt-2 text-xs text-green-700">
              <p>Please review your application details before submitting.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium ">Loan Details</h3>
        <Card className="shadow-none">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Loan Type:
                </span>
                <span className="text-sm font-medium">{loanType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Loan Amount:
                </span>
                <span className="text-sm font-medium">
                  Ksh{' '}
                  {(
                    Number.parseFloat(loanAmount?.toString()) || 0
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Purpose:</span>
                <span className="text-sm font-medium capitalize">
                  {purpose || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Repayment Period:
                </span>
                <span className="text-sm font-medium">
                  {repaymentPeriod || '3'} months
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-sm font-medium ">
          {guarantors.length > 0 ? 'Guarantors' : 'No guarantors'}
        </h3>
        {guarantors && guarantors.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10">Name</TableHead>
                <TableHead className="h-10 text-center">
                  Amount Guaranteed
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guarantors?.map((guarantor, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm font-medium py-2">
                    {guarantor.guarantorName.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-sm font-medium py-2 text-center">
                    Ksh{' '}
                    {(
                      Number.parseFloat(
                        guarantor.amountGuaranteed?.toString(),
                      ) || 0
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="rounded-md bg-muted text-muted-foreground p-4 text-xs ">
          <p>
            By submitting this application, you confirm that all information
            provided is accurate and you agree to the terms and conditions. Your
            application will be reviewed and you will be notified of the
            decision via SMS.
          </p>
        </div>
      </div>
    </div>
  )
}
