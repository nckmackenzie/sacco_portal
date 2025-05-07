import type {SVGAttributes} from 'react';
import { cn } from '@/lib/utils'

interface AppLogoProps extends React.ComponentProps<'div'> {
  className?: string
}

export default function AppLogo({ className, ...props }: AppLogoProps) {
  return (
    <div className={cn('flex gap-x-2 items-center', className)} {...props}>
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full">
        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-none font-semibold">
          Sacco Member Portal
        </span>
      </div>
    </div>
  )
}

function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-wallet2"
      viewBox="0 0 16 16"
    >
      <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
    </svg>
  )
}
