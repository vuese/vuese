/**
 * Copy from https://github.com/djyde/koy
 * Modified by HcySunYang
 */

const fs = require('fs')
const markded = require('marked')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')

function parse(content) {
  markded.setOptions({
    highlight: function(code, lang) {
      if (!Prism.languages[lang]) {
        loadLanguages([lang])
      }
      const c = Prism.highlight(code, Prism.languages[lang], lang)
      return c
    }
  })
  return markded(content)
}

module.exports = parse
