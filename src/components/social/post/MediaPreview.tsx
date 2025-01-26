import { X } from "lucide-react";

interface MediaPreviewProps {
  files: File[];
  onRemove: (file: File) => void;
  isPosting: boolean;
}

export const MediaPreview = ({ files, onRemove, isPosting }: MediaPreviewProps) => {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          {file.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              className="w-full h-48 object-cover rounded-xl"
              controls
            />
          )}
          <button
            onClick={() => onRemove(file)}
            disabled={isPosting}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};