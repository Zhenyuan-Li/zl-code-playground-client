/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import bundle from '../bundler';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setError(output.error);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} bundlingStatus={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
