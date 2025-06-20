import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente principal App

// Crea la raíz de la aplicación React y renderiza el componente App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);