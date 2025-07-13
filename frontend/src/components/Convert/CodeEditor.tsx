import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'javascript' | 'python';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          {language === 'javascript' ? 'JavaScript' : 'Python'} Code
        </span>
      </div>
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;