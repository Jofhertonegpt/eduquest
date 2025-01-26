import { ImagePlus, Smile, Film, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  onMediaClick: () => void;
  isPosting: boolean;
}

export const PostActions = ({ onMediaClick, isPosting }: PostActionsProps) => {
  return (
    <div className="flex items-center gap-2 text-primary">
      <button
        onClick={onMediaClick}
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
  );
};