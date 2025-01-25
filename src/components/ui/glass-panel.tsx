import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const GlassPanel = ({ children, className, ...props }: GlassPanelProps) => {
  return (
    <div 
      className={cn(
        "backdrop-blur-sm bg-white/30 dark:bg-gray-950/30 border border-white/20 dark:border-gray-800/20 shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};