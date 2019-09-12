import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss';

const rootEl = document.getElementById('root');

render(<App />, rootEl);

if (module.hot) {
  module.hot.accept();
}
