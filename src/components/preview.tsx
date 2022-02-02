import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

// Problem 1: the code could be extremely large and will have hard time to print in some browser
// Problem 2: in iframe: some code is in script, but some are in body. etc import ReactDOM.
// because some script tag in source code cut flow. console.log('<script></script>')
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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iframe = useRef<any>();
  useEffect(() => {
    // reset the iframe after one run
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  // Embedding one child doc to display in one parent doc
  // To disallow cross-frame access iframe content should be loaded from a different domain or port
  return (
    <iframe
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
      title="preview"
    />
  );
};

export default Preview;
