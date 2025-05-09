import { LoaderCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'accent' | 'light'
  thickness?: 'thin' | 'regular' | 'thick'
  className?: string
}

export function Loader({
  size = 'md',
  variant = 'primary',
  thickness = 'regular',
  className,
}: LoaderProps) {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  }

  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    light: 'text-white/80',
  }

  const thicknessValues = {
    thin: '1.5',
    regular: '2',
    thick: '2.5',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        <LoaderCircleIcon
          className={cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant],
          )}
          strokeWidth={thicknessValues[thickness]}
        />
      </div>
    </div>
  )
}

export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader size="lg" />
      {message && (
        <p className="mt-4 text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

export function ButtonLoader({ className }: { className?: string }) {
  return <Loader size="xs" className={cn('mr-2', className)} />
}

export function TableLoader() {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center">
      <Loader size="md" variant="secondary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading data...</p>
    </div>
  )
}
