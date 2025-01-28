import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Card } from '@/components/ui/card';

// Initialize Monaco features
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});

monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2015,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  typeRoots: ["node_modules/@types"],
  lib: ["es2015"]
});

// Add extra libraries
monaco.languages.typescript.javascriptDefaults.addExtraLib(`
  declare class Console {
    log(message?: any, ...optionalParams: any[]): void;
  }
  declare const console: Console;
`, 'ts:console.d.ts');

interface MonacoEditorProps {
  initialValue?: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light';
  onChange?: (value: string) => void;
  height?: string;
  width?: string;
  readOnly?: boolean;
}

export function MonacoEditor({
  initialValue = '',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  height = '400px',
  width = '100%',
  readOnly = false
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Configure editor features
      const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        value: initialValue,
        language,
        theme,
        automaticLayout: true,
        minimap: {
          enabled: true,
          scale: 0.75,
          renderCharacters: false
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        readOnly,
        cursorStyle: 'line',
        wordWrap: 'on',
        folding: true,
        lineDecorationsWidth: 10,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        snippetSuggestions: 'inline',
        tabCompletion: 'on',
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        formatOnType: true,
        formatOnPaste: true,
        links: true,
        parameterHints: {
          enabled: true
        }
      };

      editor.current = monaco.editor.create(editorRef.current, editorOptions);

      // Add actions
      editor.current.addAction({
        id: 'format-code',
        label: 'Format Code',
        keybindings: [
          monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF
        ],
        run: (ed) => {
          ed.getAction('editor.action.formatDocument').run();
        }
      });

      // Handle content changes
      editor.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editor.current?.getValue() || '');
        }
      });

      // Add IntelliSense providers
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };

          const suggestions = [
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'console.log($0)',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'function ${1:name}(${2:params}) {\n\t$0\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range
            },
            {
              label: 'if',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'if (${1:condition}) {\n\t$0\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range
            }
          ];

          return { suggestions };
        }
      });

      return () => {
        editor.current?.dispose();
      };
    }
  }, [initialValue, language, theme, onChange, readOnly]);

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
      <div
        ref={editorRef}
        style={{
          height,
          width,
          overflow: 'hidden'
        }}
      />
    </Card>
  );
}