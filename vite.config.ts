import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    vanillaExtractPlugin(),
  ],
  base: './',
  build: {
    outDir: 'dist',
  },
}))

