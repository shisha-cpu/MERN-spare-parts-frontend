import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Header from './Components/Header';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store';
import './main.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store} >
      <Header />
       <App />
    </Provider> 
    </BrowserRouter>
  </React.StrictMode>
);
