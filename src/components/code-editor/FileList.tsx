import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderTree } from "lucide-react";
import { memo } from "react";

interface FileListProps {
  files: Record<string, { language: string }>;
  currentFile: string;
  onFileSelect: (filename: string) => void;
}

const FileList = memo(({ files, currentFile, onFileSelect }: FileListProps) => {
  return (
    <div className="w-48 border-r pr-4">
      <div className="flex items-center gap-2 mb-4">
        <FolderTree className="h-4 w-4" />
        <span className="font-semibold">Files</span>
      </div>
      <ScrollArea className="h-[calc(80vh-8rem)]">
        <div className="space-y-2">
          {Object.entries(files).map(([filename]) => (
            <Button
              key={filename}
              variant={currentFile === filename ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-mono"
              onClick={() => onFileSelect(filename)}
            >
              {filename}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

FileList.displayName = "FileList";

export default FileList;