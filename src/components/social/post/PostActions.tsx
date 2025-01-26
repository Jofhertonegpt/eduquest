import { Button } from "@/components/ui/button";
import { ImagePlus, Smile, Film, BarChart2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  onFileClick: () => void;
  isPosting: boolean;
  canPost: boolean;
  onPost: () => void;
}

export const PostActions = ({ onFileClick, isPosting, canPost, onPost }: PostActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center gap-2 text-primary">
        <button
          onClick={onFileClick}
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
        onClick={onPost}
        disabled={!canPost || isPosting}
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
  );
};