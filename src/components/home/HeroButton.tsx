import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const HeroButton = ({ 
  variant = "primary",
  children,
  className,
  ...props
}: HeroButtonProps) => {
  return (
    <button
      className={cn(
        "px-8 py-3 rounded-full font-medium transition-all duration-200",
        variant === "primary" 
          ? "bg-primary text-primary-foreground hover:opacity-90" 
          : "border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};