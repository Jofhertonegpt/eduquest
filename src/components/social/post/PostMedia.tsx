import { useState } from "react";
import { MediaViewer } from "./MediaViewer";

interface PostMediaProps {
  mediaUrls: string[];
  mediaMetadata?: any[];
}

export const PostMedia = ({ mediaUrls, mediaMetadata }: PostMediaProps) => {
  const [showMediaViewer, setShowMediaViewer] = useState(false);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {mediaUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer"
            onClick={() => setShowMediaViewer(true)}
          >
            <img
              src={url}
              alt={mediaMetadata?.[index]?.alt_text || ''}
              className="object-cover w-full h-full rounded-lg"
            />
            {mediaMetadata?.[index]?.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm rounded-b-lg">
                {mediaMetadata[index].caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {showMediaViewer && (
        <MediaViewer
          urls={mediaUrls}
          metadata={mediaMetadata}
          onClose={() => setShowMediaViewer(false)}
          isOpen={showMediaViewer}
        />
      )}
    </>
  );
};