import type { z } from 'zod'
import type {
  passwordFormSchema,
  profileFormSchema,
} from '@/features/profile/utils/schema'
// import type { passwordFormSchema } from '@/features/profile/utils/schema'

export type ProfileFormValues = z.infer<typeof profileFormSchema>
export type PasswordFormValues = z.infer<typeof passwordFormSchema>
