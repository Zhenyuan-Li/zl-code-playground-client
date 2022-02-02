import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import React from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  // This will be executed when the editor is first rendered on the screen
  // getValue() will return the current code in the editor.
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // To detect the change of content.
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    // Change the tab size to 2
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    //
  };

  // To use the type support, add monaco-editor and check the doc
  return (
    <MonacoEditor
      editorDidMount={onEditorDidMount}
      value={initialValue}
      theme="dark"
      height="500px"
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
      }}
    />
  );
};

export default CodeEditor;
