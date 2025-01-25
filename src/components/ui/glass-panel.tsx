import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export const GlassPanel = ({ children, className }: GlassPanelProps) => {
  return (
    <div 
      className={cn(
        "backdrop-blur-sm bg-white/30 dark:bg-gray-950/30 border border-white/20 dark:border-gray-800/20 shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};