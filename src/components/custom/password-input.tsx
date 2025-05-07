import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  Icon?: React.ReactNode
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, Icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {Icon}
          </div>
        )}
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pe-10', `${Icon ? 'pl-10' : ''}`, className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? 'Hide password' : 'Show password'}
          className="absolute transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
