import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  // 部署域名
  site: 'https://www.my-site.dev'
})
