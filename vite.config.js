import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Icons from 'unplugin-icons/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    Icons({
      compiler: 'svelte',
      autoInstall: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Anki Template Designer',
        short_name: 'Anki Designer',
        description: 'Visual editor for Anki card templates and styling',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#1e1e1e',
        background_color: '#121212',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  // GitHub Pages 部署需要设置 base 路径
  // 如果仓库名是 anki-template-designer，则 base 为 '/anki-template-designer/'
  // 如果使用自定义域名或部署到根路径，则设置为 '/'
  base: process.env.GITHUB_PAGES ? '/anki-template-designer/' : '/',
  build: {
    outDir: 'dist',
  },
})
