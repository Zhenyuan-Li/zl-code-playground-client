import React from 'react';
import MonacoEditor from '@monaco-editor/react';

import prettier from 'prettier';
import parser from 'prettier/parser-babel';

import './code-editor.css';

interface CodeEditorProps {
  value: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const onEditorChange = (code: string | undefined) => onChange(code || '');

  const onFormatClick = () => {
    // get current value from editor
    // format that value, set value back in the editor
    // const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier
      .format(value, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');
    onChange(formatted);
  };

  // To use the type support, add monaco-editor and check the doc
  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
        type="button"
      >
        Format
      </button>
      <MonacoEditor
        onChange={onEditorChange}
        value={value}
        theme="vs-dark"
        height="100%"
        language="javascript"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
