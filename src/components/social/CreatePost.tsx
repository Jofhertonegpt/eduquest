"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Smile, Globe, X, Loader2, Image as ImageIcon, Film, BarChart2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { FileUploader } from "./post/FileUploader";
import { HashtagManager } from "./post/HashtagManager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
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
        upsert: true,
        onUploadProgress: (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: (progress.loaded / progress.total) * 100
          }));
        }
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
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[120px] resize-none border-none text-xl bg-transparent"
          />
          
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-48 object-cover rounded-xl"
                      controls
                    />
                  )}
                  <button
                    onClick={() => handleFileRemove(file)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <HashtagManager
            hashtags={hashtags}
            hashtagInput={hashtagInput}
            isUploading={isPosting}
            onHashtagInputChange={setHashtagInput}
            onHashtagAdd={handleHashtagAdd}
            onHashtagRemove={handleHashtagRemove}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-primary">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,video/*"
                disabled={isPosting}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-2 rounded-full hover:bg-primary/10 transition",
                  isPosting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isPosting}
              >
                <ImagePlus className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "p-2 rounded-full hover:bg-primary/10 transition",
                  isPosting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isPosting}
              >
                <Film className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "p-2 rounded-full hover:bg-primary/10 transition",
                  isPosting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isPosting}
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "p-2 rounded-full hover:bg-primary/10 transition",
                  isPosting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isPosting}
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>
            
            <Button
              onClick={handlePost}
              disabled={(!content.trim() && files.length === 0) || isPosting}
              className="rounded-full px-6"
            >
              {isPosting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};