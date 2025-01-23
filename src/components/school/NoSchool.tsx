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
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        To get started, you'll need to join a school. This will allow you to connect
        with classmates and access school-specific resources.
      </p>
      <Button onClick={() => navigate("/join-school")}>
        Find and Join a School
      </Button>
    </motion.div>
  );
};