import React from 'react';
import ReactDOM from 'react-dom/client';
import Navigator from './core/navigation/Navigator';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navigator />
    </BrowserRouter>
  </React.StrictMode>
);
