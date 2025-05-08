import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CameraIcon, PencilIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import type { ProfileFormValues } from '@/features/profile/utils/types'
import type { User } from '@/types/index.types'
import UserAvartar from '@/components/custom/user-avartar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { formatDate, handleApiErrors } from '@/lib/formatters'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import SubmitButton from '@/components/custom/submit-button'
import { Input } from '@/components/ui/input'
import { profileFormSchema } from '@/features/profile/utils/schema'
import axios from '@/lib/api/axios'

export function PersonalInformation() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <div className="space-y-6">
      <AvatarForm user={user} />
      <InformationForm user={user} />
    </div>
  )
}

export function AvatarForm({ user }: { user: User }) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-y-4 items-center sm:flex-row sm:justify-between">
        <div className="flex items-center gap-x-4">
          <UserAvartar
            userName={user.name}
            userPhoto={user.member?.photo ?? undefined}
            className="size-24"
          />
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            {user.member?.registrationDate && (
              <p className="text-sm text-muted-foreground">
                Member Since {formatDate(user.member.registrationDate)}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <CameraIcon aria-hidden className="icon-muted" />
          <span>Change Profile Picture</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export function InformationForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      alternateNo: user.member?.alternateNo ?? '',
      contact: user.contact || '',
      email: user.email || '',
      name: user.name || '',
    },
    resolver: zodResolver(profileFormSchema),
  })

  React.useEffect(() => {
    if (!isEditing) {
      form.reset({
        alternateNo: user.member?.alternateNo ?? '',
        contact: user.contact || '',
        email: user.email || '',
        name: user.name || '',
      })
    }
  }, [user, form, isEditing])

  function handleReset() {
    form.reset()
    setIsEditing(false)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      await axios.patch('/api/profile', data)
    },
    onError(error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 422) {
          handleApiErrors(error.response.data.errors, form.setError)
        } else {
          toast.error(
            error.response?.data.error || error.response?.data.message,
          )
        }
      } else {
        toast.error('An unexpected error occurred.')
      }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully.')
      handleReset()
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    },
  })

  return (
    <Card className="shadow-none">
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-muted-foreground self-center">
            Personal Information
          </h3>
          {!isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon aria-hidden className="icon-muted" />
              <span className="text-sm text-muted-foreground">Edit</span>
            </Button>
          )}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutate(data)
            })}
            className="form-grid"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isPending}
                      // placeholder="Idris Elba"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>Phone No</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isPending}
                      // placeholder="0700000000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateNo"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>Alternate Phone No</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isPending}
                      // placeholder="0700000000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-6">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      disabled={!isEditing || isPending}
                      // placeholder="test@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditing && (
              <div className="col-full flex items-center justify-end gap-x-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  type="button"
                  disabled={isPending}
                >
                  <XIcon className="icon-muted" aria-hidden />
                  <span>Cancel</span>
                </Button>
                <SubmitButton buttonText="Save Changes" isPending={isPending} />
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
