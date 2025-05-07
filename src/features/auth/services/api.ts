// import type { LoginFormValues } from "../utils/types";
import type { LoginFormValues } from '@/features/auth/utils/types'
import { errorHandler } from '@/lib/formatters'
import axios from '@/lib/api/axios'

export const getCsrfToken = async () => {
  await axios.get('/sanctum/csrf-cookie')
}

export async function login(values: LoginFormValues) {
  try {
    await getCsrfToken()
    await axios.post('/api/login', values)
  } catch (error) {
    errorHandler(error)
  }
}
