import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}

export const HeroButton = ({ variant, children, onClick }: HeroButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        onClick={onClick}
        variant={variant === "primary" ? "default" : "outline"}
        size="lg"
        className="rounded-full"
      >
        {children}
      </Button>
    </motion.div>
  );
};