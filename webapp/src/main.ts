// windicss layers
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// your custom styles here
import './styles/main.css'
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css'
// windicss devtools support (dev only)
import 'virtual:windi-devtools'

import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

// register vue composition api globally
import { ViteSSG } from 'vite-ssg'
import { setupI18n } from '@suiji/locale'
import { initModules } from './initModules'
import App from './App.vue'
import { pinia } from '@/internal'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  async({ app }) => {
    app.use(pinia)

    await initModules()

    await setupI18n(app)
  },
)
