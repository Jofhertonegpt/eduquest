import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostContainer } from "./PostContainer";
import { PostActions } from "./PostActions";
import { toast } from "@/hooks/use-toast";
import { MediaUploader } from "./MediaUploader";
import { MediaPreview } from "./MediaPreview";

interface CreatePostProps {
  onSuccess?: () => void;
}

export const CreatePost = ({ onSuccess }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaMetadata, setMediaMetadata] = useState<any[]>([]);

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setMediaMetadata(files.map(() => ({})));
  };

  const handleRemoveFile = (file: File) => {
    const index = selectedFiles.indexOf(file);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newMetadata = mediaMetadata.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setMediaMetadata(newMetadata);
  };

  const handleMetadataChange = (index: number, field: string, value: string) => {
    const newMetadata = [...mediaMetadata];
    newMetadata[index] = { ...newMetadata[index], [field]: value };
    setMediaMetadata(newMetadata);
  };

  const uploadMedia = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const mediaUrls: string[] = [];
    
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('social-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('social-media')
        .getPublicUrl(filePath);

      mediaUrls.push(publicUrl);
    }

    return mediaUrls;
  };

  const handleSubmit = async () => {
    if (!content.trim() && selectedFiles.length === 0) return;

    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let mediaUrls: string[] = [];
      if (selectedFiles.length > 0) {
        mediaUrls = await uploadMedia();
      }

      const { error } = await supabase
        .from("social_posts")
        .insert({
          content,
          user_id: user.id,
          media_urls: mediaUrls,
          media_metadata: mediaMetadata
        });

      if (error) throw error;

      setContent("");
      setSelectedFiles([]);
      setMediaMetadata([]);
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <PostContainer author="You">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none"
        disabled={isPosting}
      />
      
      <MediaPreview
        files={selectedFiles}
        onRemove={handleRemoveFile}
        isPosting={isPosting}
        metadata={mediaMetadata}
        onMetadataChange={handleMetadataChange}
      />

      <div className="flex justify-between items-center">
        <PostActions
          likesCount={0}
          commentsCount={0}
          onLike={() => {}}
          onComment={() => {}}
          onMediaClick={() => document.getElementById('media-upload')?.click()}
          isPosting={isPosting}
        />
        <div className="flex gap-4">
          <MediaUploader
            onFileSelect={handleFileSelect}
            maxFiles={4}
            accept="image/*"
            disabled={isPosting}
          />
          <Button 
            onClick={handleSubmit}
            disabled={(!content.trim() && selectedFiles.length === 0) || isPosting}
          >
            Post
          </Button>
        </div>
      </div>
    </PostContainer>
  );
};