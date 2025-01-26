import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MediaUploaderProps {
  onFileSelect: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
}

export const MediaUploader = ({
  onFileSelect,
  maxFiles = 4,
  accept = "image/*,video/*",
  disabled = false
}: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const selectedFiles = Array.from(files);
    if (selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files at once`,
        variant: "destructive",
      });
      return;
    }

    onFileSelect(selectedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-primary bg-primary/10" : "border-muted"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center gap-2">
        <Image className="h-8 w-8 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </div>
        <p className="text-xs text-muted-foreground">
          Up to {maxFiles} files supported
        </p>
      </div>
    </div>
  );
};