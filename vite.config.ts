import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Mengizinkan penggunaan process.env.API_KEY di kode client-side
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});