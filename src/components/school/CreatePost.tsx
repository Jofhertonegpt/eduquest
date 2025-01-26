import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { DEFAULT_SCHOOL } from "@/data/defaultSchool";
import { MediaUploader } from "../social/post/MediaUploader";
import { MediaPreview } from "../social/post/MediaPreview";

export const CreatePost = ({ schoolId }: { schoolId: string }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // First ensure the school exists
  const { data: schoolExists } = useQuery({
    queryKey: ["school-exists", schoolId],
    queryFn: async () => {
      if (schoolId === DEFAULT_SCHOOL.id) {
        const { data: existingSchool } = await supabase
          .from("schools")
          .select("id")
          .eq("id", DEFAULT_SCHOOL.id)
          .single();

        if (!existingSchool) {
          const { error: createError } = await supabase
            .from("schools")
            .insert(DEFAULT_SCHOOL);
          
          if (createError) {
            console.error("Error creating default school:", createError);
            return false;
          }
        }
        return true;
      }

      const { data } = await supabase
        .from("schools")
        .select("id")
        .eq("id", schoolId)
        .single();

      return !!data;
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('social-media')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('social-media')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        setIsUploading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("Not authenticated");

        if (!schoolExists) {
          throw new Error("School does not exist");
        }

        // Upload all files first
        const mediaUrls = files.length > 0 ? await Promise.all(files.map(uploadFile)) : [];

        const postData = {
          school_id: schoolId,
          content: content.trim(),
          created_by: user.id,
          created_at: new Date().toISOString(),
          media_urls: mediaUrls,
        };

        console.log("Attempting to create post with data:", postData);

        const { data, error } = await supabase
          .from("school_posts")
          .insert(postData)
          .select()
          .single();

        if (error) {
          console.error("Supabase error details:", error);
          throw error;
        }
        
        console.log("Post created successfully:", data);
        return data;
      } catch (error: any) {
        console.error("Error in createPostMutation:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["school-posts", schoolId] });
      
      const previousPosts = queryClient.getQueryData(["school-posts", schoolId]);
      
      queryClient.setQueryData(["school-posts", schoolId], (old: any[]) => {
        const optimisticPost = {
          id: 'temp-' + Date.now(),
          content: newContent,
          created_at: new Date().toISOString(),
          created_by: 'loading',
          school_id: schoolId,
          likes_count: 0,
          comments_count: 0,
          media_urls: [],
          profiles: {
            id: 'loading',
            full_name: 'Posting...',
            avatar_url: null
          }
        };
        return [optimisticPost, ...(old || [])];
      });
      
      return { previousPosts };
    },
    onError: (error: any, variables, context) => {
      console.error("Error creating post:", error);
      queryClient.setQueryData(["school-posts", schoolId], context?.previousPosts);
      
      let errorMessage = "Failed to create post. Please try again.";
      if (error.code === "42501") {
        errorMessage = "You don't have permission to create posts in this school.";
      } else if (error.code === "23502") {
        errorMessage = "Missing required fields.";
      } else if (error.code === "23503") {
        errorMessage = "The school you're trying to post to doesn't exist.";
      } else if (error.code === "23505") {
        errorMessage = "This post already exists.";
      } else if (error.status === 409) {
        errorMessage = "There was a conflict creating your post. Please try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setContent("");
      setFiles([]);
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["school-posts", schoolId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;
    console.log("Submitting post with content:", content);
    createPostMutation.mutate(content);
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleFileRemove = (file: File) => {
    setFiles(prev => prev.filter(f => f !== file));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="min-h-[100px] resize-none"
        disabled={createPostMutation.isPending || isUploading}
      />
      
      <MediaUploader
        onFileSelect={handleFileSelect}
        disabled={createPostMutation.isPending || isUploading}
      />
      
      <MediaPreview
        files={files}
        onRemove={handleFileRemove}
        isPosting={createPostMutation.isPending || isUploading}
      />

      <Button 
        type="submit" 
        disabled={(!content.trim() && files.length === 0) || createPostMutation.isPending || isUploading || !schoolExists}
        className="w-full sm:w-auto"
      >
        {(createPostMutation.isPending || isUploading) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUploading ? 'Uploading...' : 'Posting...'}
          </>
        ) : (
          'Post'
        )}
      </Button>
    </form>
  );
};