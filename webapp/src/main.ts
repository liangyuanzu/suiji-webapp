import 'normalize.css'
import 'virtual:svg-icons-register'
// vue-virtual-scroller
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
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
import { setupI18n } from '@suiji/locale'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import { initModules } from './initModules'
import App from './App.vue'
import { pinia } from '@/internal'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.path === '/signup' || to.path === '/signin' || to.path.startsWith('/sign'))
    return next()

  const token = localStorage.getItem('token')
  if (!token)
    return next('/signin')
  else
    next()
})

const bootstrap = async() => {
  const app = createApp(App)

  app.use(VueVirtualScroller)

  app.use(pinia)

  await initModules()

  await setupI18n(app)

  app.use(router)

  app.mount('#app')
}

bootstrap()
