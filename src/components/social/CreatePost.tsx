import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostInput } from "./post/PostInput";
import { MediaPreview } from "./post/MediaPreview";
import { MediaMetadataForm } from "./post/MediaMetadataForm";
import { PostActions } from "./post/PostActions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MediaMetadata {
  alt_text?: string;
  caption?: string;
}

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [mediaMetadata, setMediaMetadata] = useState<MediaMetadata[]>([]);
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
    
    setFiles(prev => [...prev, ...selectedFiles]);
    setMediaMetadata(prev => [
      ...prev,
      ...selectedFiles.map(() => ({ alt_text: "", caption: "" }))
    ]);
  };

  const handleFileRemove = (file: File) => {
    const index = files.indexOf(file);
    if (index > -1) {
      setFiles(prev => prev.filter((_, i) => i !== index));
      setMediaMetadata(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleMetadataChange = (index: number, field: keyof MediaMetadata, value: string) => {
    setMediaMetadata(prev => prev.map((meta, i) => 
      i === index ? { ...meta, [field]: value } : meta
    ));
  };

  const uploadFile = async (file: File, index: number): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('social-media')
      .upload(filePath, file);

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
        mediaUrls = await Promise.all(files.map((file, index) => uploadFile(file, index)));
      }

      const { error } = await supabase
        .from("social_posts")
        .insert({
          content: content.trim(),
          user_id: user.id,
          media_urls: mediaUrls,
          media_metadata: mediaMetadata
        });

      if (error) throw error;

      setContent("");
      setFiles([]);
      setMediaMetadata([]);
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
          
          <div className="space-y-4">
            <MediaPreview 
              files={files}
              onRemove={handleFileRemove}
              isPosting={isPosting}
            />
            {files.map((file, index) => (
              <MediaMetadataForm
                key={index}
                index={index}
                metadata={mediaMetadata[index]}
                isPosting={isPosting}
                onChange={handleMetadataChange}
              />
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,video/*"
            disabled={isPosting}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <PostActions
              onMediaClick={() => fileInputRef.current?.click()}
              isPosting={isPosting}
            />
            
            <Button
              onClick={handlePost}
              disabled={!content.trim() && files.length === 0 || isPosting}
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