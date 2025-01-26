import { useState } from "react";

interface MediaMetadata {
  alt_text?: string;
  caption?: string;
}

interface MediaMetadataFormProps {
  index: number;
  metadata: MediaMetadata;
  isPosting: boolean;
  onChange: (index: number, field: keyof MediaMetadata, value: string) => void;
}

export const MediaMetadataForm = ({ 
  index, 
  metadata, 
  isPosting, 
  onChange 
}: MediaMetadataFormProps) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Add alt text for accessibility"
        value={metadata.alt_text || ""}
        onChange={(e) => onChange(index, "alt_text", e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm"
        disabled={isPosting}
      />
      <input
        type="text"
        placeholder="Add a caption"
        value={metadata.caption || ""}
        onChange={(e) => onChange(index, "caption", e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm"
        disabled={isPosting}
      />
    </div>
  );
};