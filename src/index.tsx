/* eslint-disable @typescript-eslint/no-explicit-any */
import 'bulmaswatch/solar/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import CodeEditor from './components/code-editor';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import Preview from './components/preview';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const transpileHandler = async () => {
    if (!ref.current) {
      return;
    }

    // // step 1: transpile the code
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015',
    // });
    // console.log(result);
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      // use this param for the .env constant
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  // Problem 1: the code could be extremely large and will have hard time to print in some browser
  // Problem 2: in iframe: some code is in script, but some are in body. etc import ReactDOM.
  // because some script tag in source code cut flow. console.log('<script></script>')
  return (
    <div>
      <CodeEditor
        initialValue="const a =1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={transpileHandler} type="button">
          Submit
        </button>
      </div>
      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
