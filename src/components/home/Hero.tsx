import { motion } from "framer-motion";
import { HeroButton } from "./HeroButton";
import { useNavigate } from "react-router-dom";
import type { HeroProps } from "@/types/home";

export const Hero = ({ 
  title = "Transform Your Learning Journey",
  subtitle = "Welcome to EduQuest",
  description = "Discover a new way of learning with our interactive platform designed to help you achieve your educational goals."
}: HeroProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    const featuredSection = document.getElementById("featured-courses");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <HeroButton onClick={handleGetStarted}>
              Get Started
            </HeroButton>
            <HeroButton variant="secondary" onClick={handleLearnMore}>
              Learn More
            </HeroButton>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
    </section>
  );
};