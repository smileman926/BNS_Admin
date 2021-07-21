import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

import Header from './components/Header';
import Aside from './components/Aside';
import Footer from './components/Footer';
import 'antd/dist/antd.css';
import './style/common.scss';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <BrowserRouter>
        <Header />
        <Aside />
        <App />
        <Footer />
      </BrowserRouter>
    </PersistGate>
  </Provider>, document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
