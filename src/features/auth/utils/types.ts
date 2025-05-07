import type { z } from 'zod'
import type { loginFormSchema } from '@/features/auth/utils/schema'

export type LoginFormValues = z.infer<typeof loginFormSchema>
