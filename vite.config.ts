import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' deixa o build funcionando em qualquer pasta (GitHub Pages, Vercel, abrir local)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5173 },
});
