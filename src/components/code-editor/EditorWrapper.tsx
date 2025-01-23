import { Editor, type EditorProps, useMonaco } from "@monaco-editor/react";
import { memo, useEffect } from "react";

interface EditorWrapperProps extends EditorProps {
  height?: string;
}

const EditorWrapper = memo(({ height = "calc(80vh - 2rem)", ...props }: EditorWrapperProps) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Configure JavaScript/TypeScript intelligence
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      });

      // Add basic type definitions
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        `
        declare const React: any;
        declare const console: { log: (...args: any[]) => void };
        `,
        "globals.d.ts"
      );
    }
  }, [monaco]);

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
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnCommitCharacter: true,
          quickSuggestions: true,
          quickSuggestionsDelay: 10,
          parameterHints: {
            enabled: true,
          },
          tabCompletion: "on",
          bracketPairColorization: {
            enabled: true,
          },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          formatOnSave: true,
          showUnused: true,
          showDeprecated: true,
          inlineSuggest: {
            enabled: true,
          },
        }}
        {...props}
      />
    </div>
  );
});

EditorWrapper.displayName = "EditorWrapper";

export default EditorWrapper;