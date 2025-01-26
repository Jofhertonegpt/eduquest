import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`alt-text-${index}`}>Alt text</Label>
        <Input
          id={`alt-text-${index}`}
          placeholder="Describe the image for accessibility"
          value={metadata.alt_text || ""}
          onChange={(e) => onChange(index, "alt_text", e.target.value)}
          disabled={isPosting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`caption-${index}`}>Caption</Label>
        <Textarea
          id={`caption-${index}`}
          placeholder="Add a caption to your image"
          value={metadata.caption || ""}
          onChange={(e) => onChange(index, "caption", e.target.value)}
          disabled={isPosting}
          rows={3}
        />
      </div>
    </div>
  );
};