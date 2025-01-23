import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, School, Users, MessageSquare, Send, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Dashboard = () => {
  const [message, setMessage] = useState("");
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

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) {
        toast.error("Failed to load messages");
        throw error;
      }
      return data;
    },
  });

  const handleJoinSchool = async () => {
    toast.info("Coming soon: Join a school!");
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          content: message,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

    if (error) {
      toast.error("Failed to send message");
      return;
    }

    setMessage("");
    toast.success("Message sent!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-xl p-6 hover-scale"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <School className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">My Schools</h2>
          </div>
          {loadingSchools ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
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
          variants={itemVariants}
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
          variants={itemVariants}
          className="glass-panel rounded-xl p-6 hover-scale"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          <div className="space-y-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {messages?.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-background rounded-lg border"
                    >
                      <p className="font-semibold text-sm text-primary">
                        {msg.profiles?.full_name}
                      </p>
                      <p className="text-sm">{msg.content}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;