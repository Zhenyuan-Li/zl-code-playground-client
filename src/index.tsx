/* eslint-disable @typescript-eslint/no-explicit-any */
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulmaswatch/solar/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CellList from './components/cell-list';
import { store } from './state';

const App = () => (
  <Provider store={store}>
    <div>
      <CellList />
    </div>
  </Provider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
