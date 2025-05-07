import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import type { LoginFormValues } from '@/features/auth/utils/types'
import axios from '@/lib/api/axios'
import { login } from '@/features/auth/services/api'
import { router } from '@/main'
import { userQueryOptions } from '@/features/auth/services/query-options'

export function useAuth() {
  const queryClient = useQueryClient()

  const userQuery = useQuery({ ...userQueryOptions() })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => login(values),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
      router.navigate({ to: '/dashboard', replace: true })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/logout')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
      queryClient.clear()
      router.navigate({ to: '/login', replace: true })
    },
  })

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLogginIn: loginMutation.isPending,
    isLogginOut: logoutMutation.isPending,
  }
}
