import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "acrylic";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    console.log('Button variant:', variant, 'is acrylic:', variant === 'acrylic');
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variant === "acrylic" ? "bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-blue-400/20 bg-clip-padding backdrop-blur-2xl border border-white/20 text-white dark:text-white shadow-lg hover:opacity-90" : variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          size === "sm" ? "h-8 px-3 text-xs" : size === "lg" ? "h-12 px-8 text-lg" : "h-10 px-4 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
