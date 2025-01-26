import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, FileText } from "lucide-react";

interface FileViewerProps {
  urls: string[];
  fileTypes?: string[];
  metadata?: any[];
}

export const FileViewer = ({ urls, fileTypes = [], metadata = [] }: FileViewerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  console.log('FileViewer received props:', { urls, fileTypes, metadata }); // Debug log

  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  };

  const handleFileClick = (url: string) => {
    console.log('File clicked:', url); // Debug log
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

  if (!urls || urls.length === 0) {
    console.log('No files to display'); // Debug log
    return null;
  }

  return (
    <>
      <div className={`grid ${getGridCols()} gap-2 relative`}>
        {urls.map((url, index) => {
          if (!url) {
            console.log('Skipping empty URL at index:', index); // Debug log
            return null;
          }

          const fileType = fileTypes[index] || getFileType(url);
          const alt = metadata?.[index]?.alt_text || `File ${index + 1}`;
          console.log('Rendering file:', { url, fileType, alt }); // Debug log

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
                  onError={(e) => {
                    console.error('Image failed to load:', url); // Debug log
                    e.currentTarget.src = '/placeholder.svg';
                  }}
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
                  onError={(e) => console.error('Video failed to load:', url)} // Debug log
                />
              </div>
            );
          }

          return (
            <div 
              key={url}
              className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer gap-2"
              onClick={() => handleFileClick(url)}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">View File</span>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          {selectedFile && (
            <div className="relative w-full h-full flex items-center justify-center">
              {getFileType(selectedFile) === 'pdf' ? (
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
                  onError={(e) => {
                    console.error('Preview image failed to load:', selectedFile); // Debug log
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
              
              {getFileType(selectedFile) === 'pdf' && (
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