/* eslint-disable @typescript-eslint/no-explicit-any */
import 'bulmaswatch/solar/bulmaswatch.min.css';
import ReactDOM from 'react-dom';

import CodeCell from './components/code-cell';

const App = () => <CodeCell />;

ReactDOM.render(<App />, document.querySelector('#root'));
