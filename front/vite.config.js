import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode'],
    esbuildOptions: {
      // Añadir esta opción
      keepNames: true,
    },
  }, // <-- Aquí se agregó el paréntesis de cierre correctamente
});
