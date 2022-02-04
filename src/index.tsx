/* eslint-disable @typescript-eslint/no-explicit-any */
import 'bulmaswatch/solar/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';
import { store } from './state';

const App = () => (
  <Provider store={store}>
    <div>
      <TextEditor />
    </div>
  </Provider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
