import * as React from "react";
import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, variant = "primary", disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-input bg-transparent hover:bg-slate-100 text-slate-900",
      ghost: "hover:bg-slate-100 text-slate-700",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variants[variant],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";