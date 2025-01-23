import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AcademicProgress } from "@/components/profile/AcademicProgress";
import { Achievements } from "@/components/profile/Achievements";

const Profile = () => {
  const { userData, isLoading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    level: "Intermediate",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-panel rounded-xl p-6">
          <ProfileHeader
            name={profile.name}
            email={profile.email}
            editMode={editMode}
            onNameChange={(name) => setProfile({ ...profile, name })}
            onEditToggle={() => setEditMode(true)}
            onSave={() => {
              updateProfile({
                name: profile.name,
                level: profile.level,
              });
              setEditMode(false);
            }}
          />
        </div>

        <AcademicProgress
          currentDegree={userData?.profile?.current_degree}
        />

        <Achievements />
      </div>
    </motion.div>
  );
};

export default Profile;