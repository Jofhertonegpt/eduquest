import { X, FileText, Video, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type FilePreviewProps = {
  file: File;
  progress: number;
  isUploading: boolean;
  onRemove: (file: File) => void;
};

export const FilePreview = ({ file, progress, isUploading, onRemove }: FilePreviewProps) => {
  return (
    <div className="flex items-center gap-2 bg-muted p-2 rounded relative">
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
        onClick={() => onRemove(file)}
        className="hover:text-destructive"
        disabled={isUploading}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};