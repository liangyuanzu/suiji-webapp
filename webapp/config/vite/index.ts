import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import type { Plugin } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import WindiCSS from 'vite-plugin-windicss'
import legacy from '@vitejs/plugin-legacy'
import { configPwaConfig } from './pwa'
import { configImageminPlugin } from './imagemin'
import { configCompressPlugin } from './compress'
import { configAutoImportPlugin } from './autoImport'
import { configAutoImportComponentsPlugin } from './autoImportComponents'
import { configMarkdownPlugin } from './markdown'

export { configProxy } from './proxy'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'
export const configVitePlugins = (viteEnv: ViteEnv, isBuild: boolean) => {
  const {
    VITE_USE_IMAGEMIN,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv

  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // have to
    // https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx
    vueJsx(),
  ]

  // https://github.com/hannoeru/vite-plugin-pages
  vitePlugins.push(Pages({
    extensions: ['vue', 'md'],
  }))

  // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
  vitePlugins.push(Layouts())

  // https://github.com/antfu/unplugin-icons
  vitePlugins.push(Icons({
    autoInstall: true,
  }))

  // https://github.com/antfu/unplugin-auto-import
  vitePlugins.push(configAutoImportPlugin())

  // https://github.com/antfu/unplugin-vue-components
  vitePlugins.push(configAutoImportComponentsPlugin())

  // https://github.com/antfu/vite-plugin-md
  vitePlugins.push(configMarkdownPlugin(markdownWrapperClasses))

  // https://github.com/antfu/vite-plugin-windicss
  vitePlugins.push(WindiCSS({
    safelist: markdownWrapperClasses,
  }))

  // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // https://github.com/antfu/vite-plugin-inspect
  vitePlugins.push(Inspect({
    // change this to enable inspect for debugging
    enabled: false,
  }))

  // The following plugins only work in the production environment
  if (isBuild) {
    // vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin())

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
      ),
    )

    // vite-plugin-pwa
    vitePlugins.push(configPwaConfig(viteEnv))
  }

  return vitePlugins
}
