import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importamos los estilos globales y de leaflet que ya teníamos definidos
import './App.css';
import 'leaflet/dist/leaflet.css';


// 1. Selecciona el elemento del DOM donde se montará la aplicación de React.
//    Esto corresponde al <div id="root"></div> en public/index.html
const rootElement = document.getElementById('root');

// 2. Crea la raíz de la aplicación usando la API moderna de React 18.
const root = ReactDOM.createRoot(rootElement);

// 3. Renderiza el componente principal <App /> dentro de la raíz.
//    <React.StrictMode> es un contenedor que ayuda a detectar problemas
//    potenciales en la aplicación durante el desarrollo. No afecta la
//    build de producción.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);