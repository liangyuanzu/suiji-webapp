/**
 * Zero-config PWA for Vite
 * @see https://github.com/antfu/vite-plugin-pwa
 */
import { VitePWA } from 'vite-plugin-pwa'

export const configPwaConfig = (env: ViteEnv) => {
  const { VITE_USE_PWA, VITE_GLOB_APP_TITLE, VITE_GLOB_APP_SHORT_NAME } = env

  if (VITE_USE_PWA) {
    // vite-plugin-pwa
    const pwaPlugin = VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
      manifest: {
        name: VITE_GLOB_APP_TITLE,
        short_name: VITE_GLOB_APP_SHORT_NAME,
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    })
    return pwaPlugin
  }
  return []
}
