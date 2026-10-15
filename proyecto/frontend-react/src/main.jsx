import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthProvider.jsx';
import '@fontsource-variable/bricolage-grotesque/wdth.css'; // fuente propia (se empaqueta con la app, no depende de Google)
import './index.css';

// Orden de las "capas": el router da las rutas y la autenticación queda disponible en toda la app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
