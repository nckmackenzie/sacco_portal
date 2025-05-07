import { z } from 'zod'
import { requiredStringSchemaEntry } from '@/lib/schema-entries'

export const loginFormSchema = z.object({
  contact: requiredStringSchemaEntry('Phone number is required').min(10, {
    message: 'Phone number must be at least 10 characters long',
  }),
  password: requiredStringSchemaEntry('Password is required').min(6, {
    message: 'Password must be at least 6 characters long',
  }),
})
