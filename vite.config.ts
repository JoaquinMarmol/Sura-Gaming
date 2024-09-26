import { defineConfig } from 'vite';

export default defineConfig({
  base: './',  // Asegura que el valor sea el correcto
  build: {
    outDir: 'dist',
  },
});

