/**
 * Vite Plugin for fast creating SVG sprites.
 * @see https://github.com/anncwb/vite-plugin-svg-icons
 */

import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
  })
  return svgIconsPlugin
}
