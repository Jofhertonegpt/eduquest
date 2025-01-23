import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NoSchool = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 text-center max-w-2xl"
    >
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Learning Journey</h1>
      <p className="text-muted-foreground mb-8">
        You'll be automatically joined to our Learning Hub where you can find guides,
        resources, and connect with other learners. You can also join additional schools
        to access specific programs and communities.
      </p>
      <Button onClick={() => navigate("/join-school")}>
        Browse More Schools
      </Button>
    </motion.div>
  );
};