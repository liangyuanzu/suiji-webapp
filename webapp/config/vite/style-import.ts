/**
 * A plug-in that imports component library styles on demand.it is fast
 * @see https://github.com/vbenjs/vite-plugin-style-import
 */
import {
  AndDesignVueResolve,
  createStyleImportPlugin,
} from 'vite-plugin-style-import'

export const configStyleImportPlugin = () => {
  return createStyleImportPlugin({
    resolves: [AndDesignVueResolve()],
  })
}
