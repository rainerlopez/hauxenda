import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Hauxenda",
        short_name: "Hxnda",
        description:
          "A simple PWA for managing Ceremonies and Atendees by Rainer E. Lopez (rainerdev@gmail.com)",
        theme_color: "#305544",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "maskable_icon_x48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable_icon_x72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable_icon_x96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable_icon_x128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          }
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});