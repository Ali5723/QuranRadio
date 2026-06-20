import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: false,
      },

      workbox: {
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              expiration: {
                maxEntries: 50,
              },
              networkTimeoutSeconds: 3,
            },
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },

      manifest: {
        name: "Quran Radio",
        short_name: "quranradio",
        description:
          "This website gives you access to over 100 stations to help you listen to the Quran from your favorite reciters easily.",
        theme_color: "#2ec27e",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    open: true,
  },
  base: "/",
});
