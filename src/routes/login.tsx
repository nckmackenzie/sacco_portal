import { createFileRoute } from '@tanstack/react-router'
import AppLogo from '@/components/custom/logo'
import { LoginForm } from '@/features/auth/components/login-form'
import loginLight from '@/assets/login-light.svg'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background rounded-md shadow h-full grid sm:grid-cols-2 sm:gap-4 p-4">
      <div className="rounded-2xl flex flex-col">
        <AppLogo />
        <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full">
          <LoginForm />
        </div>
      </div>
      <div className="bg-primary hidden rounded-2xl sm:flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl p-4 text-background">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium leading-tight">
              Effortlessly access our services and products!
            </h2>
            <p className="mt-2 text-sm text-accent-foreground">
              Please enter your credentials to access your account.
            </p>
          </div>
          <img src={loginLight} alt="Some image" className="w-full h-auto " />
        </div>
      </div>
    </div>
  )
}
