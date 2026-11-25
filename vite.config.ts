import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/' – the app uses real paths (/presenter, /hall, /worksheet, /HERO).
// Vercel (vercel.json) and `vite preview` both send every path to index.html.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
