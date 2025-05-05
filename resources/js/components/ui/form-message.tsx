import { cn } from "@/lib/utils";
import React from "react";

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
    message: string;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
    ({ message, className, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn('text-[0.8rem] font-medium text-destructive', className)}
                {...props}
            >
                {message}
            </p>
        );
    }
);
FormMessage.displayName = 'FormMessage';

export {FormMessage}