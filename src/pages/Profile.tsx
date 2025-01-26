"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { XHeader } from "@/components/social/profile/XHeader";
import { ProfileStats } from "@/components/social/profile/ProfileStats";
import { ProfileBio } from "@/components/social/profile/ProfileBio";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, isLoading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    level: "Intermediate",
    bio: "",
    location: "",
    website: "",
    avatar_url: "",
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
        bio: userData.profile?.bio || '',
        location: userData.profile?.location || '',
        website: userData.profile?.website || '',
        avatar_url: userData.profile?.avatar_url || '',
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
      className="min-h-screen bg-background"
    >
      <div className="max-w-4xl mx-auto">
        <XHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          editMode={editMode}
          onEditToggle={() => setEditMode(true)}
          onSave={async () => {
            await updateProfile(profile);
            setEditMode(false);
          }}
        />

        <ProfileBio
          profile={profile}
          editMode={editMode}
          onChange={(updates) => setProfile({ ...profile, ...updates })}
        />

        <ProfileStats
          postsCount={userData?.profile?.posts_count || 0}
          followersCount={userData?.profile?.followers_count || 0}
          followingCount={userData?.profile?.following_count || 0}
        />

        <Tabs defaultValue="achievements" className="w-full mt-4">
          <TabsList className="w-full border-b rounded-none">
            <TabsTrigger value="achievements" className="flex-1">Achievements</TabsTrigger>
            <TabsTrigger value="courses" className="flex-1">Courses</TabsTrigger>
            <TabsTrigger value="certificates" className="flex-1">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            {/* Achievement content will go here */}
          </TabsContent>
          <TabsContent value="courses">
            {/* Courses content will go here */}
          </TabsContent>
          <TabsContent value="certificates">
            {/* Certificates content will go here */}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Profile;