/**
 * On-demand components auto importing for Vue.
 * @see https://github.com/antfu/unplugin-vue-components
 */
import IconsResolver from 'unplugin-icons/resolver'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export const configAutoImportComponentsPlugin = () => {
  return Components({
    // allow auto load markdown components under `./src/components/`
    extensions: ['vue', 'md'],

    // allow auto import and register components used in markdown
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

    // custom resolvers
    resolvers: [
      // auto import icons
      // https://github.com/antfu/unplugin-icons
      IconsResolver({
        componentPrefix: '',
        // enabledCollections: ['carbon']
      }),

      // auto import ant-design-vue components
      // https://next.antdv.com
      AntDesignVueResolver({
        resolveIcons: true,
        importStyle: 'less',
      }),
    ],

    dts: 'src/types/components.d.ts',
  })
}
