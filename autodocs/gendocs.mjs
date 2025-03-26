import * as fs from 'fs'
import { parseHTML } from 'linkedom'
import nmd from 'nano-markdown'

const { HTMLElement, document} = parseHTML(`
  <!doctype html>
  <html lang="en">
    <head>
      <title>nJS - A nano sized reactive framework</title>
      <link rel="stylesheet" href="nano.css"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dark.min.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script>
      <script>hljs.highlightAll();</script>
    </head>
    <body>
    </body>
  </html>
`)

global.document = document
global.HTMLElement = HTMLElement

import { tags, add, html } from '../nanojs/dom.mjs'
import { style } from '../nanojs/style.mjs'
import { S } from '../nanojs/utils.mjs'

const style_example = style({
    background: 'var(--accent)',
    width: '80ch',
    color: 'var(--bg)',
    border: '1px solid var(--border)',
    padding: '0.5rem 1rem',
    'font-family': 'var(--mono)',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s'
})

const { pre, script, div, h4, code } = tags()

const add_md = (filename) => {
  const md = fs.readFileSync(filename, 'utf8')
  const body = nmd(md)
  const node = html(body)
  add(document.body, node)
}

const add_js = (filename) => {
    const js = fs.readFileSync(filename, 'utf8')
    const jsscript = script({type: 'module'}, js)
    add(document.body, jsscript)
}

add_md('./header.md')

const snippets = fs.globSync('./snippets/*.js').sort()
for (const snippet of snippets) {
  const id = snippet.split('_').pop().replace('.js', '')
  console.log(id)

  const md = fs.readFileSync(`./${snippet.replace('.js', '.md')}`, 'utf8')
  const body = nmd(md)
  const node = html(body)
  add(document.body, node)

  const js = fs.readFileSync(`./${snippet}`, 'utf8')
  if (js !== "") {
      const jscode = pre(code({class: "language-javascript"}, js))
      const jsscript = script({type: 'module'}, js)
      add(document.body, h4("code"), jscode, h4("example"), div({style: style_example, id}), jsscript)
  }
}

add_md('./footer.md')
add_js('./menu.js')

fs.writeFileSync('./build/index.html', document.documentElement.outerHTML)