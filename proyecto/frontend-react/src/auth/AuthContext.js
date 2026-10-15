import { createContext } from 'react';

// El "contenedor" de estado global: guarda quién inició sesión y las funciones para entrar y salir
export const AuthContext = createContext(null);
