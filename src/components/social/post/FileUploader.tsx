import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FilePreview } from "../FilePreview";

interface FileUploaderProps {
  files: File[];
  isUploading: boolean;
  uploadProgress: Record<string, number>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (file: File) => void;
}

export const FileUploader = ({
  files,
  isUploading,
  uploadProgress,
  onFileSelect,
  onFileRemove
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        multiple
        className="hidden"
        accept="image/*,video/*,application/*"
        disabled={isUploading}
      />

      <div className="flex flex-wrap gap-2">
        {files.map((file) => (
          <FilePreview
            key={file.name}
            file={file}
            progress={uploadProgress[file.name] || 0}
            isUploading={isUploading}
            onRemove={onFileRemove}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
};