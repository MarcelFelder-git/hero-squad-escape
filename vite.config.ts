import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' => the build works from any folder / sub-path (USB stick, school server, GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: './',
});
