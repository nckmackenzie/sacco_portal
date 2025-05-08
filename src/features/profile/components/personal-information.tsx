import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CameraIcon, Loader2, PencilIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import Dropzone from 'react-dropzone'
import type { QueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()
  if (!user) return null
  return (
    <div className="space-y-6">
      <AvatarForm user={user} queryClient={queryClient} />
      <InformationForm user={user} queryClient={queryClient} />
    </div>
  )
}

export function AvatarForm({
  user,
  queryClient,
}: {
  user: User
  queryClient: QueryClient
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axios.post('/api/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: () => {
      toast.success('Profile picture updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    },
    onError: (err) => {
      console.error(err)
      toast.error(
        'An unexpected error occurred while uploading your photo. Please try again',
      )
    },
  })

  const handleFileDrop = React.useCallback(
    (acceptedFiles: Array<File>) => {
      if (!acceptedFiles.length) return

      const formData = new FormData()
      formData.append('photo', acceptedFiles[0])

      mutate(formData)
    },
    [mutate],
  )

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
        <Dropzone
          onDrop={handleFileDrop}
          disabled={isPending}
          maxFiles={1}
          multiple={true}
          onError={(err) => toast.error(err.message)}
          accept={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
            'image/jpg': ['.jpg'],
          }}
          onDropRejected={() => toast.error('Invalid file type')}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps({
                className: 'dropzone rounded-md text-center',
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-muted-foreground text-sm">
                  Drop the files here ...
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CameraIcon className="mr-2 h-4 w-4" />
                    )}
                    {isPending ? 'Uploading....' : 'Change Picture'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </CardContent>
    </Card>
  )
}

export function InformationForm({
  user,
  queryClient,
}: {
  user: User
  queryClient: QueryClient
}) {
  const [isEditing, setIsEditing] = React.useState(false)

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
