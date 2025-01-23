import { motion } from "framer-motion";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { AssignmentsList } from "@/components/dashboard/AssignmentsList";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CourseProgressCard />
          </div>
          <div className="lg:col-span-1">
            <NotificationPanel />
          </div>
          <div className="lg:col-span-3">
            <AssignmentsList />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;