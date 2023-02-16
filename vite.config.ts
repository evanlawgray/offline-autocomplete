import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@type': path.resolve(__dirname, './src/type'),
      '@util': path.resolve(__dirname, './src/util')
    }
  },
  plugins: [react()]
});
