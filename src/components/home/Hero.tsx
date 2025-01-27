import { motion } from "framer-motion";
import { HeroButton } from "./HeroButton";
import type { HeroProps } from "@/types/home";

export const Hero = ({ 
  title = "Transform Your Learning Journey",
  subtitle = "Welcome to EduQuest",
  description = "Discover a new way of learning with our interactive platform designed to help you achieve your educational goals."
}: HeroProps) => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            {subtitle}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
            {description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <HeroButton variant="primary">Get Started</HeroButton>
            <HeroButton variant="secondary">Learn More</HeroButton>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
    </section>
  );
};