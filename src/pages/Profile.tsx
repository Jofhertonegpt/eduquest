import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AcademicProgress } from "@/components/profile/AcademicProgress";
import { Achievements } from "@/components/profile/Achievements";
import { PostList } from "@/components/social/PostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, isLoading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    level: "Intermediate",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const isOwnProfile = !id || (userData?.user && id === userData.user.id);

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
            editMode={editMode && isOwnProfile}
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

        {isOwnProfile && (
          <>
            <AcademicProgress
              currentDegree={userData?.profile?.current_degree}
            />
            <Achievements />
          </>
        )}

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            {isOwnProfile && (
              <>
                <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex-1">Bookmarks</TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="posts">
            <PostList userId={id || userData?.user?.id} type="profile" />
          </TabsContent>
          {isOwnProfile && (
            <>
              <TabsContent value="likes">
                <PostList type="likes" />
              </TabsContent>
              <TabsContent value="bookmarks">
                <PostList type="bookmarks" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Profile;