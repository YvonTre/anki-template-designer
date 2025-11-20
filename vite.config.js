import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    Icons({
      compiler: 'svelte',
      autoInstall: true,
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
