import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface FileContent {
  content: string;
  language: string;
}

interface CodeEditorProps {
  initialValue?: string;
  initialFiles?: Record<string, FileContent>;
  onChange?: (value: string) => void;
  'aria-label'?: string;
}

const CodeEditor = ({ initialValue = '', initialFiles, onChange, 'aria-label': ariaLabel }: CodeEditorProps) => {
  const [value, setValue] = useState(initialValue || (initialFiles && Object.values(initialFiles)[0]?.content) || '');

  const handleChange = (newValue: string | undefined) => {
    if (newValue) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const language = initialFiles ? Object.values(initialFiles)[0]?.language : 'javascript';

  return (
    <div className="h-[300px] border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={handleChange}
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