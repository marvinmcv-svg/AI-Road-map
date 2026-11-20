// Builds the STUDENT site only (missions, word cards, toolkit).
// Its entry never imports teacher lesson plans, so they are not in this bundle.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./student', import.meta.url));

export default defineConfig({
  root,
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  server: { fs: { allow: [fileURLToPath(new URL('.', import.meta.url))] } },
  build: { outDir: fileURLToPath(new URL('./dist-student', import.meta.url)), emptyOutDir: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'AI Creators Guild',
        short_name: 'AI Guild',
        description: 'Student missions, word cards and toolkit for the AI Creators course.',
        theme_color: '#7c5cff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] }
    })
  ]
});
