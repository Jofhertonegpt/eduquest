import { Editor } from "@monaco-editor/react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Code2, FolderTree } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

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
  },
  "program.cpp": {
    content: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello from C++!\" << std::endl;\n    return 0;\n}",
    language: "cpp"
  },
  "program.cs": {
    content: "using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello from C#!\");\n    }\n}",
    language: "csharp"
  }
};

interface CodeEditorProps {
  initialFiles?: FileSystem;
}

const CodeEditor = ({ initialFiles = defaultFiles }: CodeEditorProps) => {
  const [files, setFiles] = useState<FileSystem>(initialFiles);
  const [currentFile, setCurrentFile] = useState<string>(Object.keys(files)[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (content: string | undefined) => {
    if (content !== undefined) {
      setFiles(prev => ({
        ...prev,
        [currentFile]: {
          ...prev[currentFile],
          content
        }
      }));
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Code2 className="h-4 w-4" />
          Open Editor
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="h-full p-4 flex">
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
                    className="w-full justify-start text-sm"
                    onClick={() => setCurrentFile(filename)}
                  >
                    {filename}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 pl-4">
            <Editor
              height="calc(80vh - 2rem)"
              language={files[currentFile].language}
              value={files[currentFile].content}
              onChange={handleFileChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CodeEditor;