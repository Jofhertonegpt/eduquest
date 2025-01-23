import { motion } from "framer-motion";

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="font-display text-4xl font-bold mb-6">Profile</h1>
      <div className="glass-panel rounded-xl p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10" />
            <div>
              <h2 className="text-xl font-bold">Student Name</h2>
              <p className="text-muted-foreground">student@example.com</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Progress Overview</h3>
            <div className="h-2 bg-primary/10 rounded-full">
              <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;