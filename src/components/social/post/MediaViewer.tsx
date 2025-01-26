import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
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
  const [scale, setScale] = useState(1);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : urls.length - 1));
    setScale(1); // Reset zoom when changing images
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < urls.length - 1 ? prev + 1 : 0));
    setScale(1); // Reset zoom when changing images
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const currentMetadata = metadata[currentIndex] || {};

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-screen-lg w-full h-[80vh] p-0 bg-background/95 backdrop-blur-sm">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute top-2 right-2 z-50 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
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
            <div className="flex-1 relative overflow-hidden">
              <img
                src={urls[currentIndex]}
                alt={currentMetadata.alt_text || "Post image"}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${scale})` }}
              />
            </div>
            <div className="p-4 bg-background/80 backdrop-blur-sm space-y-2">
              {currentMetadata.alt_text && (
                <p className="text-xs text-muted-foreground">
                  Alt text: {currentMetadata.alt_text}
                </p>
              )}
              {currentMetadata.caption && (
                <p className="text-sm text-foreground">{currentMetadata.caption}</p>
              )}
              <div className="flex justify-center gap-2">
                {urls.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-muted"
                    }`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setScale(1);
                    }}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};