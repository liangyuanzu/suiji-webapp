/**
 * Markdown for Vite
 * Use Markdown as Vue components
 * Use Vue components in Markdown
 * @see https://github.com/antfu/vite-plugin-md
 */
import LinkAttributes from 'markdown-it-link-attributes'
import Prism from 'markdown-it-prism'
import Markdown from 'vite-plugin-md'

// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
export const configMarkdownPlugin = (wrapperClasses: string) => {
  return Markdown({
    wrapperClasses,
    headEnabled: true,
    markdownItSetup(md) {
      // https://prismjs.com/
      md.use(Prism)
      md.use(LinkAttributes, {
        pattern: /^https?:\/\//,
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
      })
    },
  })
}
