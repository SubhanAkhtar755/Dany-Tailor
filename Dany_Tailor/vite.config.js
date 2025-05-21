import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto', // or 'script' if you're manually calling registerSW()

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'Dany_Tailor',
        short_name: 'Dany_Tailor',
        description: 'The Unique tailor In The World',
        theme_color: '#101240',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })
  ]
});
