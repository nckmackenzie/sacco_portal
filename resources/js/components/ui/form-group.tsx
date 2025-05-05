import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";


interface FormGroupProps extends PropsWithChildren {
    className?: string;
}

export function FormGroup({className,children}: FormGroupProps) {
  return (
    <div className={cn('space-y-2',className)}>
        {children}
    </div>
  )
}
