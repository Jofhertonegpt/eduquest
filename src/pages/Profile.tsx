import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, GraduationCap, Trophy, Settings } from "lucide-react";

interface Grade {
  subject: string;
  score: number;
  date: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Student Name",
    email: "student@example.com",
    level: "Intermediate",
  });
  const [grades, setGrades] = useState<Grade[]>([
    { subject: "Mathematics", score: 85, date: "2024-02-20" },
    { subject: "Science", score: 92, date: "2024-02-19" },
  ]);

  const handleProfileUpdate = () => {
    setEditMode(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

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

        {/* Grades Section */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Grade Tracking</h3>
          </div>
          <div className="space-y-4">
            {grades.map((grade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50"
              >
                <div>
                  <h4 className="font-semibold">{grade.subject}</h4>
                  <p className="text-sm text-muted-foreground">{grade.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold ${
                      grade.score >= 90
                        ? "text-green-500"
                        : grade.score >= 80
                        ? "text-blue-500"
                        : "text-orange-500"
                    }`}
                  >
                    {grade.score}%
                  </span>
                </div>
              </div>
            ))}
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
                title: "Consistent",
                description: "Logged in for 7 days straight",
                icon: "🎯",
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