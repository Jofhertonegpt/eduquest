import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface PostFormProps {
  content: string;
  isUploading: boolean;
  onContentChange: (content: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PostForm = ({ 
  content, 
  isUploading, 
  onContentChange, 
  onSubmit 
}: PostFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="What's on your mind?"
        className="min-h-[100px]"
        disabled={isUploading}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={(!content.trim() && !isUploading)}
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