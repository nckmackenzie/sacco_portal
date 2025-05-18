import { z } from 'zod'
import {
  optionalNumberSchemaEntry,
  requiredNumberSchemaEntry,
  requiredStringSchemaEntry,
} from '@/lib/schema-entries'

export const loanFormSchema = z.object({
  loanType: requiredStringSchemaEntry('Select Loan type.'),
  loanAmount: requiredNumberSchemaEntry('Enter Loan amount.'),
  purpose: requiredStringSchemaEntry('Enter Loan purpose.'),
  repaymentPeriod: requiredNumberSchemaEntry('Enter Loan repayment .'),
  loanLimit: optionalNumberSchemaEntry(),
  canSelfGuarantee: z.boolean(),
  guarantors: z
    .object({
      guarantorId: requiredStringSchemaEntry('Enter Guarantor ID.'),
      amountGuaranteed: requiredNumberSchemaEntry(
        'Enter amount guaranteed by the Guarantor.',
      ),
    })
    .optional(),
})
