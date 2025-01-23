import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { useState, useCallback } from "react";
import FileList from "./code-editor/FileList";
import EditorWrapper from "./code-editor/EditorWrapper";

interface FileSystem {
  [key: string]: {
    content: string;
    language: string;
  };
}

const defaultFiles: FileSystem = {
  "index.html": {
    content: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>",
    language: "html"
  },
  "styles.css": {
    content: "body {\n  margin: 0;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}",
    language: "css"
  },
  "script.js": {
    content: "// JavaScript code here\nconsole.log('Hello from JavaScript!');",
    language: "javascript"
  }
};

interface CodeEditorProps {
  initialFiles?: FileSystem;
}

const CodeEditor = ({ initialFiles = defaultFiles }: CodeEditorProps) => {
  const [files, setFiles] = useState<FileSystem>(initialFiles);
  const [currentFile, setCurrentFile] = useState<string>(Object.keys(files)[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = useCallback((content: string | undefined) => {
    if (content !== undefined) {
      setFiles(prev => ({
        ...prev,
        [currentFile]: {
          ...prev[currentFile],
          content
        }
      }));
    }
  }, [currentFile]);

  const handleFileSelect = useCallback((filename: string) => {
    setCurrentFile(filename);
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2 hover:bg-accent">
          <Code2 className="h-4 w-4" />
          Open Editor
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="h-full p-4 flex glass-panel">
          <FileList
            files={files}
            currentFile={currentFile}
            onFileSelect={handleFileSelect}
          />
          <EditorWrapper
            language={files[currentFile].language}
            value={files[currentFile].content}
            onChange={handleFileChange}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CodeEditor;