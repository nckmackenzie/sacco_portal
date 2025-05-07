import { z } from 'zod'
import {
  optionalStringSchemaEntry,
  requiredStringSchemaEntry,
} from '@/lib/schema-entries'

export const profileFormSchema = z.object({
  name: requiredStringSchemaEntry(),
  email: optionalStringSchemaEntry(),
  contact: requiredStringSchemaEntry(),
  alternateNo: optionalStringSchemaEntry(),
})

export const passwordFormSchema = z
  .object({
    currentPassword: requiredStringSchemaEntry().refine(
      (val) => val.length > 6,
      { message: 'Password must be at least 6 characters long' },
    ),
    password: requiredStringSchemaEntry().refine((val) => val.length > 6, {
      message: 'Password must be at least 6 characters long',
    }),
    passwordConfirmation: requiredStringSchemaEntry().refine(
      (val) => val.length > 6,
      { message: 'Password must be at least 6 characters long' },
    ),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
      })
    }
  })
