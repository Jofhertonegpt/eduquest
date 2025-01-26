import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaPreviewProps {
  files: File[];
  onRemove: (file: File) => void;
  isPosting?: boolean;
}

export const MediaPreview = ({ files, onRemove, isPosting }: MediaPreviewProps) => {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : file.type.startsWith("video/") ? (
              <video
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              </div>
            )}
          </div>
          
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(file)}
            disabled={isPosting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};