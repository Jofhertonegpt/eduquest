import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

type HashtagInputProps = {
  hashtags: string[];
  hashtagInput: string;
  isUploading: boolean;
  onHashtagInputChange: (value: string) => void;
  onHashtagAdd: (e: React.KeyboardEvent) => void;
  onHashtagRemove: (index: number) => void;
};

export const HashtagInput = ({
  hashtags,
  hashtagInput,
  isUploading,
  onHashtagInputChange,
  onHashtagAdd,
  onHashtagRemove,
}: HashtagInputProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((tag, index) => (
        <div key={index} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => onHashtagRemove(index)}
            className="hover:text-destructive"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Input
        value={hashtagInput}
        onChange={(e) => onHashtagInputChange(e.target.value.replace(/\s/g, ''))}
        onKeyDown={onHashtagAdd}
        placeholder="Add hashtags..."
        className="w-32"
        disabled={isUploading}
      />
    </div>
  );
};