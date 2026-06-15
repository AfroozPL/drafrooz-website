import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-md bg-midnight border border-light-gray/15 px-4 py-2.5 text-sm text-white placeholder:text-muted",
      "focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/30",
      "transition-colors",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md bg-midnight border border-light-gray/15 px-4 py-2.5 text-sm text-white placeholder:text-muted resize-y min-h-[120px]",
      "focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/30",
      "transition-colors",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold tracking-wider uppercase text-light-gray mb-2",
        className,
      )}
      {...props}
    />
  );
}
