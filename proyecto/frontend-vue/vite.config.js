import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// En desarrollo usa el 5174 para no chocar con el front de React (5173).
// Ese origen ya está autorizado en CORS_ORIGENES de la API.
export default defineConfig({
  plugins: [vue()],
  server: { port: 5174, strictPort: true },
})
