import { Editor, type EditorProps } from "@monaco-editor/react";
import { memo } from "react";

interface EditorWrapperProps extends EditorProps {
  height?: string;
}

const EditorWrapper = memo(({ height = "calc(80vh - 2rem)", ...props }: EditorWrapperProps) => {
  return (
    <div className="flex-1 pl-4">
      <Editor
        height={height}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          lineNumbers: "on",
          automaticLayout: true,
          fontFamily: "monospace",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          formatOnType: true,
        }}
        {...props}
      />
    </div>
  );
});

EditorWrapper.displayName = "EditorWrapper";

export default EditorWrapper;