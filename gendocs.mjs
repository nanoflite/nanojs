import { parseHTML, Text } from 'linkedom'
import * as fs from 'fs'

const { HTMLElement, document} = parseHTML(`
  <!doctype html>
  <html lang="en">
    <head>
      <title>nanojs - docs</title>
    </head>
    <body>
    </body>
  </html>
`)

global.document = document
global.HTMLElement = HTMLElement

import { tags, add } from './nanojs/dom.mjs'

const { h1, h2, div, hr, span, a, li, ul } = tags()

const Docs = () => {
  return div(
    h1('nanojs'),
    h2('docs'),
    hr(),
    ul(
      li(a({ href: 'https://github.com/lukeed/nanojs' }, 'GitHub')),
      li(a({ href: 'https://www.npmjs.com/package/nanojs' }, 'NPM'))
    )
  )
}

add(document.body, Docs())
fs.writeFileSync('docs_/docs_.html', document.documentElement.outerHTML)