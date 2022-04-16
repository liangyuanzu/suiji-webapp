/**
 * Auto import APIs on-demand for Vite, Webpack, Rollup and esbuild.
 * @see https://github.com/antfu/unplugin-auto-import
 */
import AutoImport from 'unplugin-auto-import/vite'

export const configAutoImportPlugin = () => {
  return AutoImport({
    imports: [
      'vue',
      'vue-router',
      '@vueuse/head',
      '@vueuse/core',
      'vitest',
    ],
    dts: 'src/types/auto-imports.d.ts',
  })
}
