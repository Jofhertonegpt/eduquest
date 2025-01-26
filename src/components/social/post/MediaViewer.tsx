import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface MediaViewerProps {
  urls: string[];
  initialIndex?: number;
  metadata?: any[];
  onClose: () => void;
  isOpen: boolean;
}

export const MediaViewer = ({ urls, initialIndex = 0, metadata = [], onClose, isOpen }: MediaViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : urls.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < urls.length - 1 ? prev + 1 : 0));
  };

  const currentMetadata = metadata[currentIndex] || {};

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-screen-lg w-full h-[80vh] p-0 bg-background/95 backdrop-blur-sm">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {urls.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 z-50"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-50"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative">
              <img
                src={urls[currentIndex]}
                alt={currentMetadata.alt_text || "Post image"}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            {currentMetadata.caption && (
              <div className="p-4 bg-background/80 backdrop-blur-sm">
                <p className="text-sm text-foreground">{currentMetadata.caption}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};