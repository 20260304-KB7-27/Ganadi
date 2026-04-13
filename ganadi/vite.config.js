import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      devOptions: { enabled: true, type: 'module' },
      injectRegister: 'auto',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // '@model': fileURLToPath(new URL('./src/model', import.meta.url)),
      // '@viewmodel': fileURLToPath(new URL('./src/viewmodel', import.meta.url)),
      // '@view': fileURLToPath(new URL('./src/view', import.meta.url)),
    },
  },

  // server: {
  //   proxy: {
  //     'https://railway-production-eae7.up.railway.app': {
  //       target: 'https://railway-production-eae7.up.railway.app',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\https://railway-production-eae7.up.railway.app/, ''),
  //     },
  //   },
  // },
});
