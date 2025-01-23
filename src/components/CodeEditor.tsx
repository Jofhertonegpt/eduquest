import { Editor } from "@monaco-editor/react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { useState } from "react";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
}

const CodeEditor = ({ 
  initialCode = "// Write your code here", 
  language = "javascript" 
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Code2 className="h-4 w-4" />
          Open Editor
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="h-full p-4">
          <Editor
            height="100%"
            defaultLanguage={language}
            defaultValue={code}
            onChange={(value) => setCode(value || "")}
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
      </DrawerContent>
    </Drawer>
  );
};

export default CodeEditor;