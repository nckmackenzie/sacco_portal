import { AlertCircle, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorProps {
  title?: string
  message?: string
  variant?: 'warning' | 'error'
  action?: {
    label?: string
    onClick: () => void
  }
  className?: string
}

export function ErrorComponent({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  variant = 'error',
  action,
  className,
}: ErrorProps) {
  return (
    <Alert
      variant={variant === 'warning' ? 'default' : 'destructive'}
      className={cn(
        'animate-fade-in border-2 flex flex-col items-center text-center p-6 max-w-md mx-auto my-4',
        variant === 'warning'
          ? 'bg-orange-200/5 border-orange-200 dark:bg-orange-900/5 dark:border-orange-900'
          : 'bg-rose-200/5 border-rose-200 dark:bg-rose-900/5 dark:border-rose-900',

        className,
      )}
    >
      <div className="mb-4">
        {variant === 'error' ? (
          <AlertCircle className="h-12 w-12 text-sacco-error" />
        ) : (
          <AlertTriangle className="h-12 w-12 text-sacco-highlight" />
        )}
      </div>

      <AlertTitle className="text-lg font-semibold mb-2">{title}</AlertTitle>
      <AlertDescription className="text-base">{message}</AlertDescription>

      {action && (
        <Button
          onClick={action.onClick}
          variant="destructive"
          className={cn('mt-6')}
        >
          {action.label || 'Retry'}
        </Button>
      )}
    </Alert>
  )
}
