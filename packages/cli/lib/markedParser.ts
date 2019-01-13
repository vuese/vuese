/**
 * Copy from https://github.com/djyde/koy
 * Modified by HcySunYang
 */

import markded from 'marked'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components'

function parse(content: string) {
  markded.setOptions({
    highlight: function(code: any, lang: any) {
      if (!Prism.languages[lang]) {
        loadLanguages([lang])
      }
      const c = Prism.highlight(code, Prism.languages[lang], lang)
      return c
    }
  })
  return markded(content)
}

export default parse
