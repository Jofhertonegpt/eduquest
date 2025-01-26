import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  FileText, Video, Music, Image, File, Code,
  Archive, Database, Globe, Book, Presentation, Table,
  Download
} from "lucide-react";
import { useState } from "react";
import { MediaViewer } from "./MediaViewer";
import { cn } from "@/lib/utils";

interface FileViewerProps {
  urls: string[];
  fileTypes: string[];
  metadata?: any[];
}

export const FileViewer = ({ urls, fileTypes, metadata = [] }: FileViewerProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const imageUrls = urls.filter((_, index) => 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileTypes[index].toLowerCase())
  );
  
  const imageMetadata = metadata.filter((_, index) => 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileTypes[index].toLowerCase())
  );

  const renderImageGrid = () => {
    if (imageUrls.length === 0) return null;

    return (
      <div 
        className={cn(
          "grid gap-1",
          imageUrls.length === 1 && "grid-cols-1",
          imageUrls.length === 2 && "grid-cols-2",
          imageUrls.length === 3 && "grid-cols-2",
          imageUrls.length >= 4 && "grid-cols-2"
        )}
      >
        {imageUrls.map((url, index) => {
          const meta = imageMetadata[index] || {};
          return (
            <div
              key={url}
              className={cn(
                "relative aspect-square cursor-pointer",
                imageUrls.length === 3 && index === 0 && "row-span-2",
                imageUrls.length >= 4 && index >= 4 && "hidden"
              )}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={url}
                alt={meta.alt_text || "Post image"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {imageUrls.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    +{imageUrls.length - 4}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderOtherFiles = () => {
    return urls.map((url, index) => {
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileTypes[index].toLowerCase())) {
        return null;
      }

      const isPDF = fileTypes[index].toLowerCase() === 'pdf';
      const isVideo = ['mp4', 'webm', 'mov'].includes(fileTypes[index].toLowerCase());

      if (isPDF) {
        return (
          <Dialog key={url}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                <FileText className="h-6 w-6" />
                <span className="flex-1 truncate">{url.split('/').pop()}</span>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  View PDF
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh]">
              <iframe
                src={url}
                className="w-full h-full rounded-lg"
                title="PDF Viewer"
              />
            </DialogContent>
          </Dialog>
        );
      }

      if (isVideo) {
        return (
          <div key={url} className="relative aspect-video w-full">
            <video 
              src={url} 
              controls 
              className="rounded-lg w-full h-full object-cover"
              controlsList="nodownload"
              playsInline
              poster={`${url}#t=0.1`}
              preload="metadata"
            >
              <track kind="captions" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }

      return (
        <div key={url} className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <File className="h-6 w-6" />
          <span className="flex-1 truncate">{url.split('/').pop()}</span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </a>
        </div>
      );
    });
  };

  return (
    <div className="space-y-2">
      {renderImageGrid()}
      {renderOtherFiles()}
      
      <MediaViewer
        urls={imageUrls}
        metadata={imageMetadata}
        initialIndex={selectedImageIndex || 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
      />
    </div>
  );
};