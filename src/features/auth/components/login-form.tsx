import { Link } from '@tanstack/react-router'
import { ArrowRight, Loader2, Lock, Phone } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { LoginFormValues } from '@/features/auth/utils/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { loginFormSchema } from '@/features/auth/utils/schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { PasswordInput } from '@/components/custom/password-input'

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    defaultValues: { password: '', contact: '' },
    resolver: zodResolver(loginFormSchema),
  })

  const { isLogginIn, login } = useAuth()

  return (
    <div className="w-full ">
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                login(data)
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        Icon={
                          <Phone className="size-4 text-muted-foreground" />
                        }
                        {...field}
                        placeholder="0722000000"
                        disabled={isLogginIn}
                        type="text"
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
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link to="/login" className="text-sm text-link">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput
                        Icon={<Lock className="size-4 text-muted-foreground" />}
                        {...field}
                        placeholder="********"
                        disabled={isLogginIn}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLogginIn}>
                {isLogginIn && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
