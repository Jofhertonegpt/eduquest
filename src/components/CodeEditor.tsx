import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface CodeEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ initialValue = '', onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.value = initialValue;
    }
  }, [initialValue]);

  return (
    <Card className="p-4">
      <textarea
        ref={editorRef}
        className="w-full h-[300px] font-mono text-sm p-2 bg-secondary"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </Card>
  );
}