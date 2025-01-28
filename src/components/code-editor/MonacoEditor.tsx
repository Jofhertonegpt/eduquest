import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Card } from '@/components/ui/card';

interface MonacoEditorProps {
  initialValue?: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light';
  onChange?: (value: string) => void;
  height?: string;
  width?: string;
}

export function MonacoEditor({
  initialValue = '',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  height = '400px',
  width = '100%'
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editor.current = monaco.editor.create(editorRef.current, {
        value: initialValue,
        language,
        theme,
        automaticLayout: true,
        minimap: {
          enabled: true
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        }
      });

      editor.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editor.current?.getValue() || '');
        }
      });

      return () => {
        editor.current?.dispose();
      };
    }
  }, [initialValue, language, theme, onChange]);

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