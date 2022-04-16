import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv } from './config'
import { configProxy, configVitePlugins } from './config/vite'

export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY } = viteEnv

  return {
    root,
    base: VITE_PUBLIC_PATH,

    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        // fix warning: You are running the esm-bundler build of vue-i18n...
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },

    server: {
      host: true,
      fs: {
        strict: true,
      },
      port: VITE_PORT,
      proxy: configProxy(VITE_PROXY),
    },

    build: {},

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
    },

    define: {
      // Suppress vue-i18-next warning
      __INTLIFY_PROD_DEVTOOLS__: false,
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/head',
        '@vue/shared',
        '@iconify-json/carbon',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        'dayjs/locale/en',
        'dayjs/locale/zh-cn',
        'lodash-es',
      ],
      exclude: [
        'vue-demi',
      ],
    },

    plugins: configVitePlugins(viteEnv, command === 'build'),

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },
  }
})
