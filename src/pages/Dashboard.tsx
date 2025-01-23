import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="font-display text-4xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Current Progress</h2>
          <p className="text-muted-foreground">Track your learning journey here</p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <p className="text-muted-foreground">View your earned badges</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;