import { useRef, useEffect } from 'react';

import './preview.css';

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

// Problem 1: the code could be extremely large and will have hard time to print in some browser
// Problem 2: in iframe: some code is in script, but some are in body. etc import ReactDOM.
// because some script tag in source code cut flow. console.log('<script></script>')
const html = `
<html>
<head>
  <style>html {background-color: white;}</style>
</head>
<body>
  <div id="root"></div>
  <script>
  const handleError = (err) => {
    const root = document.querySelector('#root');
    root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
    console.error(err);
  };

  // Handle synchronize code error
  window.addEventListener('error', (event) => {
    event.preventDefault();
    handleError(event.error);
  });

  window.addEventListener(
    'message',
    (event) => {
      try {
        eval(event.data);
      } catch (err) {
        handleError(err);
      }
    },
    false
  );
</script>
</body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus: error }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iframe = useRef<any>();
  useEffect(() => {
    // reset the iframe after one run
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  // Embedding one child doc to display in one parent doc
  // To disallow cross-frame access iframe content should be loaded from a different domain or port
  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="preview"
      />
      {error && <div className="preview-error">{error}</div>}
    </div>
  );
};

export default Preview;
