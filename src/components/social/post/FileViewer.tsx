import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  FileText, Video, Music, Image, File, Code,
  Archive, Database, Globe, Book, Presentation, Table,
  Download
} from "lucide-react";

interface FileViewerProps {
  url: string;
  fileType: string;
}

export const FileViewer = ({ url, fileType }: FileViewerProps) => {
  const getFileIcon = (type: string) => {
    const fileTypeMap: Record<string, any> = {
      pdf: FileText,
      doc: FileText,
      docx: FileText,
      txt: FileText,
      jpg: Image,
      jpeg: Image,
      png: Image,
      gif: Image,
      mp4: Video,
      webm: Video,
      avi: Video,
      mp3: Music,
      wav: Music,
      json: Code,
      xml: Code,
      html: Code,
      zip: Archive,
      rar: Archive,
      csv: Table,
      xlsx: Table,
      ppt: Presentation,
      pptx: Presentation,
      db: Database,
      epub: Book
    };

    const IconComponent = fileTypeMap[type.toLowerCase()] || File;
    return <IconComponent className="h-6 w-6" />;
  };

  const renderContent = () => {
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileType);
    const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(fileType);
    const isAudio = ['mp3', 'wav', 'ogg', 'aac'].includes(fileType);
    const isPDF = fileType === 'pdf';

    if (isImage) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <img 
              src={url} 
              alt="Post attachment" 
              className="rounded-lg max-h-96 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img src={url} alt="Full size" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      );
    }

    if (isVideo) {
      return (
        <div className="relative aspect-video w-full">
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

    if (isAudio) {
      return (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <Music className="h-6 w-6" />
          <audio 
            controls 
            className="w-full" 
            preload="metadata"
          >
            <source src={url} type={`audio/${fileType}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (isPDF) {
      return (
        <Dialog>
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

    return (
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        {getFileIcon(fileType)}
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
  };

  return renderContent();
};