import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), tsconfigPaths(), react(), checker({ typescript: true })],
  server: {
    port: 3000,
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7278',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
