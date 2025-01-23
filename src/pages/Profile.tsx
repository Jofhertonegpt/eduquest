import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, GraduationCap, Trophy, Settings } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface Grade {
  subject: string;
  score: number;
  date: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    level: "Intermediate",
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return { user, profile };
    }
  });

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.profile?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || '',
        level: userData.profile?.level || 'Intermediate',
      });
    }
  }, [userData]);

  const handleProfileUpdate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.name,
          level: profile.level,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setEditMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                {editMode ? (
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                )}
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <CodeEditor />
              <Button
                variant={editMode ? "default" : "outline"}
                onClick={() => {
                  if (editMode) {
                    handleProfileUpdate();
                  } else {
                    setEditMode(true);
                  }
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                {editMode ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Academic Progress Section */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Academic Progress</h3>
          </div>
          <div className="space-y-4">
            {userData?.profile?.current_degree && (
              <div className="p-4 rounded-lg bg-background/50">
                <h4 className="font-semibold text-lg mb-2">Current Degree Program</h4>
                <p className="text-muted-foreground">{userData.profile.current_degree}</p>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Progress</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Achievements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Fast Learner",
                description: "Completed 5 courses in record time",
                icon: "🚀",
              },
              {
                title: "Perfect Score",
                description: "Achieved 100% in a quiz",
                icon: "⭐",
              },
              {
                title: "Code Master",
                description: "Completed 10 programming challenges",
                icon: "💻",
              },
            ].map((achievement, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;