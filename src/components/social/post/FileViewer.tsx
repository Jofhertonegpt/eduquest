import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface FileViewerProps {
  urls: string[];
  fileTypes: string[];
  metadata?: any[];
}

export const FileViewer = ({ urls, fileTypes, metadata }: FileViewerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileClick = (url: string) => {
    setSelectedFile(url);
    setCurrentPage(1);
  };

  const getGridCols = () => {
    switch (urls.length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2 md:grid-cols-3';
      default: return 'grid-cols-2';
    }
  };

  return (
    <>
      <div className={`grid ${getGridCols()} gap-2 relative`}>
        {urls.map((url, index) => {
          const fileType = fileTypes[index];
          const alt = metadata?.[index]?.alt_text || `File ${index + 1}`;

          if (fileType === 'image') {
            return (
              <div 
                key={url} 
                className="relative aspect-square group cursor-pointer"
                onClick={() => handleFileClick(url)}
              >
                <img
                  src={url}
                  alt={alt}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          }

          if (fileType === 'video') {
            return (
              <div key={url} className="aspect-square">
                <video
                  src={url}
                  controls
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            );
          }

          if (fileType === 'pdf') {
            return (
              <div 
                key={url}
                className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => handleFileClick(url)}
              >
                <span className="text-sm font-medium">View PDF</span>
              </div>
            );
          }

          return null;
        })}
      </div>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          {selectedFile && (
            <div className="relative w-full h-full flex items-center justify-center">
              {selectedFile.endsWith('.pdf') ? (
                <iframe
                  src={`${selectedFile}#page=${currentPage}`}
                  className="w-full h-full"
                  title="PDF Viewer"
                />
              ) : (
                <img
                  src={selectedFile}
                  alt="Full size preview"
                  className="max-w-full max-h-full object-contain"
                />
              )}
              
              {selectedFile.endsWith('.pdf') && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">Page {currentPage}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};