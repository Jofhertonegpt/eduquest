import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, School, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { data: schools, isLoading: loadingSchools } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("student_id", (await supabase.auth.getUser()).data.user?.id);
      
      if (error) {
        toast.error("Failed to load schools");
        throw error;
      }
      return data;
    },
  });

  const handleJoinSchool = async () => {
    toast.info("Coming soon: Join a school!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Track your progress and connect with your classmates
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6 hover-scale"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <School className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">My Schools</h2>
          </div>
          {loadingSchools ? (
            <p>Loading schools...</p>
          ) : schools?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't joined any schools yet
              </p>
              <Button onClick={handleJoinSchool} className="animate-fade-in">
                <Plus className="mr-2 h-4 w-4" />
                Join a School
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {schools?.map((school) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-background rounded-lg border"
                >
                  {school.name}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-6 hover-scale"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">My Classes</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Join a school to enroll in classes
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl p-6 hover-scale"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <p className="text-muted-foreground">
            Your learning activity will appear here
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;