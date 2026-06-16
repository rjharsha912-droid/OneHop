import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightSlot, label, error, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-body">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-2xl border bg-surface px-4 transition-colors",
            "h-12 border-line focus-within:border-primary",
            error && "border-danger focus-within:border-danger"
          )}
        >
          {leftIcon && <span className="shrink-0 text-muted">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-full w-full bg-transparent text-[15px] text-ink placeholder:text-muted outline-none",
              className
            )}
            {...rest}
          />
          {rightSlot && <span className="shrink-0">{rightSlot}</span>}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
