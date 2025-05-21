import { z } from 'zod'
import {
  requiredNumberSchemaEntry,
  requiredStringSchemaEntry,
} from '@/lib/schema-entries'

export const loanFormSchema = z
  .object({
    loanType: requiredStringSchemaEntry('Select Loan type.'),
    loanAmount: requiredNumberSchemaEntry('Enter Loan amount.'),
    purpose: requiredStringSchemaEntry('Enter Loan purpose.'),
    repaymentPeriod: requiredNumberSchemaEntry('Enter Loan repayment .'),
    maximumRepaymentPeriod: requiredNumberSchemaEntry(),
    loanLimit: requiredNumberSchemaEntry(),
    canSelfGuarantee: z.boolean(),
    guarantors: z
      .array(
        z.object({
          id: z.string(),
          guarantorId: requiredStringSchemaEntry('Enter Guarantor ID.'),
          guarantorName: requiredStringSchemaEntry('Enter Guarantor name.'),
          guarantorContact: requiredStringSchemaEntry(
            'Enter Guarantor contact.',
          ).refine((val) => val.startsWith('0') && val.length === 10, {
            message: 'Invalid Phone number provided.',
          }),
          amountGuaranteed: requiredNumberSchemaEntry(
            'Enter amount guaranteed by the Guarantor.',
          ),
        }),
      )
      .optional(),
  })
  .superRefine(
    (
      { repaymentPeriod, maximumRepaymentPeriod, loanAmount, loanLimit },
      ctx,
    ) => {
      if (repaymentPeriod > maximumRepaymentPeriod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Repayment period cannot be greater than ${maximumRepaymentPeriod}.`,
          path: ['repaymentPeriod'],
        })
      }
      if (loanAmount > loanLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Loan amount cannot be greater than your current loan limit - Ksh ${loanLimit}.`,
          path: ['loanAmount'],
        })
      }
    },
  )
