'use client';

import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter your content here...",
  height = 400 
}: RichTextEditorProps) {
  const [markdown, setMarkdown] = useState(value);

  // Sync with parent component's value
  useEffect(() => {
    setMarkdown(value);
  }, [value]);

  const handleChange = (val?: string) => {
    const newValue = val || '';
    setMarkdown(newValue);
    onChange(newValue);
  };

  return (
    <div className="rich-text-editor">
      <MDEditor
        value={markdown}
        onChange={handleChange}
        height={height}
        data-color-mode="light"
        preview="edit"
        hideToolbar={false}
        visibleDragBar={false}
        textareaProps={{
          placeholder: placeholder,
          style: {
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif',
          },
        }}
        toolbarHeight={50}
      />
    </div>
  );
}
