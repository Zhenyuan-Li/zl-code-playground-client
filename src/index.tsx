import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

function App() {
  const [input, setInput] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();
  const iframe = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const html = `
  <html>
  <head></head>
  <body>
    <div id="root"></div>
    <script>
    window.addEventListener(
      'message',
      (event) => {
        try {
          eval(event.data);
        } catch (err) {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        }
      },
      false
    );
  </script>
  </body>
</html>
  `;

  // using UNPKG to find all the direct index file for the target packaging

  useEffect(() => {
    startService();
  }, []);

  const transpileHandler = async () => {
    if (!ref.current) {
      return;
    }
    // reset the iframe after one run
    iframe.current.srcdoc = html;

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

    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  // Problem 1: the code could be extremely large and will have hard time to print in some browser
  // Problem 2: in iframe: some code is in script, but some are in body. etc import ReactDOM.
  // because some script tag in source code cut flow. console.log('<script></script>')

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={transpileHandler} type="button">
          Submit
        </button>
      </div>
      {/* Embedding one child doc to display in one parent doc */}
      {/* To disallow cross-frame access iframe content should be loaded from a different domain or port */}
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="test html doc"
      />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
