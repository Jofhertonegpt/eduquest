import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const CodeEditor = ({ initialValue = '', onChange }: CodeEditorProps) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string | undefined) => {
    if (newValue) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className="h-[300px] border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
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
      />
    </div>
  );
};

export default CodeEditor;