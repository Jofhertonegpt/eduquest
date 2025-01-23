import { motion } from "framer-motion";

const Learning = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="font-display text-4xl font-bold mb-6">Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Current Module</h2>
          <p className="text-muted-foreground">No module selected</p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Resources</h2>
          <p className="text-muted-foreground">Available learning materials</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Learning;