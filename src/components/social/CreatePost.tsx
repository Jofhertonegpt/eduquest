"use client";

import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostInput } from "./post/PostInput";
import { MediaPreview } from "./post/MediaPreview";
import { PostActions } from "./post/PostActions";
import { HashtagManager } from "./post/HashtagManager";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { userData } = useProfile();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 4) {
      toast({
        title: "Error",
        description: "You can only upload up to 4 files",
        variant: "destructive",
      });
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const handleFileRemove = (file: File) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleHashtagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      if (!hashtags.includes(hashtagInput)) {
        setHashtags([...hashtags, hashtagInput]);
      }
      setHashtagInput("");
    }
  };

  const handleHashtagRemove = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('social-media')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('social-media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handlePost = async () => {
    if (!content.trim() && files.length === 0) return;
    
    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let mediaUrls: string[] = [];
      if (files.length > 0) {
        mediaUrls = await Promise.all(files.map(uploadFile));
      }

      const { error } = await supabase
        .from("social_posts")
        .insert({
          content: content.trim(),
          user_id: user.id,
          media_urls: mediaUrls,
          hashtags: hashtags,
        });

      if (error) throw error;

      setContent("");
      setFiles([]);
      setHashtags([]);
      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error) {
      console.error('Post error:', error);
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={userData?.profile?.avatar_url || "/placeholder.svg"}
            alt={userData?.profile?.full_name || ""}
          />
          <AvatarFallback>
            {userData?.profile?.full_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <PostInput 
            content={content}
            isPosting={isPosting}
            onChange={setContent}
          />
          
          <MediaPreview 
            files={files}
            onRemove={handleFileRemove}
            isPosting={isPosting}
          />

          <HashtagManager
            hashtags={hashtags}
            hashtagInput={hashtagInput}
            isUploading={isPosting}
            onHashtagInputChange={setHashtagInput}
            onHashtagAdd={handleHashtagAdd}
            onHashtagRemove={handleHashtagRemove}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,video/*"
            disabled={isPosting}
          />

          <PostActions 
            onFileClick={() => fileInputRef.current?.click()}
            isPosting={isPosting}
            canPost={!!content.trim() || files.length > 0}
            onPost={handlePost}
          />
        </div>
      </div>
    </div>
  );
};