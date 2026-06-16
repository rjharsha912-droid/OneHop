import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padded = true, interactive, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card bg-surface shadow-card border border-line/60",
        padded && "p-4",
        interactive && "transition-shadow hover:shadow-card-hover cursor-pointer",
        className
      )}
      {...rest}
    />
  )
);
Card.displayName = "Card";
