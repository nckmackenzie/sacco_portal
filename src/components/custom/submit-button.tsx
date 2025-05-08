import { CheckIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  isPending: boolean
  buttonText: string
}

export default function SubmitButton({
  isPending,
  buttonText,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? (
        <Loader2 className="animate-spin icon" />
      ) : (
        <CheckIcon className="icon" aria-hidden />
      )}
      <span>{buttonText}</span>
    </Button>
  )
}
