import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, FileText, Video, X, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@/components/ui/progress";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async ({ content, mediaUrls, fileUrls, hashtags }: { 
      content: string; 
      mediaUrls: string[]; 
      fileUrls: string[];
      hashtags: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("social_posts")
        .insert({
          content,
          user_id: user.id,
          media_urls: mediaUrls,
          file_urls: fileUrls,
          hashtags,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setContent("");
      setFiles([]);
      setHashtags([]);
      setUploadProgress({});
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "File type not supported",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(validateFile);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleHashtagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const newHashtag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
      if (!hashtags.includes(newHashtag)) {
        setHashtags([...hashtags, newHashtag]);
      }
      setHashtagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;
    
    setIsUploading(true);
    try {
      const mediaUrls: string[] = [];
      const fileUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('social-media')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              const percent = (progress.loaded / progress.total) * 100;
              setUploadProgress(prev => ({
                ...prev,
                [fileName]: percent
              }));
            }
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('social-media')
          .getPublicUrl(filePath);

        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          mediaUrls.push(publicUrl);
        } else {
          fileUrls.push(publicUrl);
        }
      }

      await createPostMutation.mutateAsync({ content, mediaUrls, fileUrls, hashtags });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderFilePreview = (file: File) => {
    const progress = uploadProgress[file.name] || 0;

    return (
      <div key={file.name} className="flex items-center gap-2 bg-muted p-2 rounded relative">
        {file.type.startsWith('image/') && (
          <div className="relative w-12 h-12">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-12 h-12 object-cover rounded"
            />
          </div>
        )}
        {file.type.startsWith('video/') && <Video className="h-4 w-4" />}
        {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
          <FileText className="h-4 w-4" />
        )}
        <div className="flex-1">
          <p className="text-sm truncate max-w-[150px]">{file.name}</p>
          {isUploading && (
            <Progress value={progress} className="h-1 mt-1" />
          )}
        </div>
        <button
          type="button"
          onClick={() => setFiles(files.filter(f => f !== file))}
          className="hover:text-destructive"
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="min-h-[100px]"
        disabled={isUploading}
      />
      
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => setHashtags(hashtags.filter((_, i) => i !== index))}
              className="hover:text-destructive"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Input
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value.replace(/\s/g, ''))}
          onKeyDown={handleHashtagAdd}
          placeholder="Add hashtags..."
          className="w-32"
          disabled={isUploading}
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
        accept="image/*,video/*,application/*"
        disabled={isUploading}
      />

      <div className="flex flex-wrap gap-2">
        {files.map(renderFilePreview)}
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          disabled={(!content.trim() && files.length === 0) || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Post'
          )}
        </Button>
      </div>
    </form>
  );
};