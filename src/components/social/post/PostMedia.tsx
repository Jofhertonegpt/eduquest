import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PostMediaProps {
  mediaUrls: string[];
  mediaMetadata?: any[];
}

export const PostMedia = ({ mediaUrls, mediaMetadata = [] }: PostMediaProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {mediaUrls.map((url, index) => {
          const metadata = mediaMetadata[index] || {};
          return (
            <div
              key={url}
              className="relative cursor-pointer"
              onClick={() => setSelectedMedia(url)}
            >
              <AspectRatio ratio={16 / 9}>
                <img
                  src={url}
                  alt={metadata.alt_text || "Post media"}
                  className="w-full h-full object-cover rounded-lg"
                />
              </AspectRatio>
              {metadata.caption && (
                <p className="text-sm text-muted-foreground mt-1">
                  {metadata.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={selectedMedia || ""}
              alt="Full size media"
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};