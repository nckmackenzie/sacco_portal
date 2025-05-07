import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { CheckIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { PasswordFormValues } from '@/features/profile/utils/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/custom/password-input'
import { passwordFormSchema } from '@/features/profile/utils/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { handleApiErrors } from '@/lib/formatters'
import axios from '@/lib/api/axios'

export function Security() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  form.setError

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PasswordFormValues) =>
      await axios.put('/api/profile/password', data),
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 422) {
          handleApiErrors(error.response.data.errors, form.setError)
        } else {
          toast.error(
            error.response?.data?.error || error.response?.data.message,
          )
        }
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An error occurred while performing this action.',
        )
      }
    },
    onSuccess: () => {
      toast.success('Password updated successfully!')
      form.reset()
    },
  })

  return (
    <Card className="shadow-none ">
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-muted-foreground self-center">
            Change Password
          </h3>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutate(data)
            })}
            className="space-y-6 max-w-md"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="********"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="********"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="********"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin icon" />
                ) : (
                  <CheckIcon className="icon" aria-hidden />
                )}
                <span>Update Password</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
