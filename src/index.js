import React from 'react';
import ReactDOM from 'react-dom';
import './main/index.css';
import App from './main/App';
import { FirebaseContext } from './context/FirebaseContext';
import { auth } from "./firebase/config";
import { ProvideAuth } from './context/AuthContext';
import reportWebVitals from './utils/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value = {{ auth }}>
    <ProvideAuth>
      <App />
    </ProvideAuth>
    </FirebaseContext.Provider>
  </React.StrictMode>
);

reportWebVitals();