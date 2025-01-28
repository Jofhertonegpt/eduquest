import { useEffect, useRef } from 'react';
import Editor, { type EditorProps, type OnMount } from '@monaco-editor/react';
import { handleError } from '@/lib/errorHandling';

type MonacoLanguage = 'javascript' | 'typescript' | 'json' | 'html' | 'css' | 'markdown';

interface FileContent {
  content: string;
  language: MonacoLanguage;
}

interface CodeEditorProps {
  initialValue?: string;
  initialFiles?: Record<string, FileContent>;
  onChange?: (value: string) => void;
  'aria-label'?: string;
}

const CodeEditor = ({ 
  initialValue = '', 
  initialFiles, 
  onChange, 
  'aria-label': ariaLabel 
}: CodeEditorProps) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  useEffect(() => {
    // Cleanup function for editor instance
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange = (newValue: string | undefined) => {
    try {
      if (newValue !== undefined) {
        onChange?.(newValue);
      }
    } catch (error) {
      handleError(error, 'CodeEditor.onChange');
    }
  };

  const language = initialFiles 
    ? (Object.values(initialFiles)[0]?.language || 'javascript') 
    : 'javascript';

  return (
    <div className="h-[300px] border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={initialValue || (initialFiles && Object.values(initialFiles)[0]?.content) || ''}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
        }}
        aria-label={ariaLabel}
      />
    </div>
  );
};

export default CodeEditor;