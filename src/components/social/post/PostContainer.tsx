import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PostContainerProps {
  children: ReactNode;
  author: string;
}

export const PostContainer = ({ children, author }: PostContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg space-y-4 bg-card"
      role="article"
      aria-label={`Post by ${author}`}
    >
      {children}
    </motion.div>
  );
};