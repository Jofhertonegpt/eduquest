"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { PostList } from "@/components/social/PostList";
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

        <Tabs defaultValue="posts" className="w-full mt-4">
          <TabsList className="w-full border-b rounded-none">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="replies" className="flex-1">Replies</TabsTrigger>
            <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <PostList type="for-you" userId={id || userData?.user?.id} />
          </TabsContent>
          <TabsContent value="replies">
            <PostList type="replies" userId={id || userData?.user?.id} />
          </TabsContent>
          <TabsContent value="media">
            <PostList type="media" userId={id || userData?.user?.id} />
          </TabsContent>
          <TabsContent value="likes">
            <PostList type="likes" userId={id || userData?.user?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Profile;
