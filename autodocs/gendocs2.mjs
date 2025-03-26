// TODO:
//  v copy test.html as the index.html
//  v copy nanojs/*, nano.css on build
//  v generate build/index.js
//  nodemon --> watch
//  gendocs2 --> gendocs
//  generate menu + router (home (mole?), docs, about, link to github)
//  use another md converter (marked)

import * as fs from 'fs'
import nmd from 'nano-markdown'
import shell from 'shelljs'

const build_folder = './build'
const target = `${build_folder}/index.js`

const append = (filename, txt) => {
  fs.appendFileSync(filename, txt)
}

const append_target = (txt) => {
  append(target, txt)
}

const escape = (txt) => txt.replaceAll('`', '\\`').replaceAll('$', '\\$')

const add_md = (filename) => {
  const md = fs.readFileSync(filename, 'utf8')
  const body = escape(nmd(md))
  append_target(`\n// ${filename}\nadd(document.body, html(\`${body}\`))\n`)
}

shell.rm('-rf', build_folder)
shell.mkdir('-p', build_folder)
shell.cp('-r', '../nanojs', build_folder)
shell.cp('../style/nano.css', build_folder)
shell.cp('index.html', build_folder)

append_target(`import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from './nanojs/index.mjs'\n`)
append_target(`const { div, p, ul, li, h4, pre, code, button, input, sup } = tags()\n`)
add_md('./header.md')

const snippets = fs.globSync('./snippets/*.js').sort()
for (const snippet of snippets) {
  const id = snippet.split('_').pop().replace('.js', '')

  const name = id.charAt(0).toUpperCase() + id.slice(1)
  const md = fs.readFileSync(`./${snippet.replace('.js', '.md')}`, 'utf8')
  const body = escape(nmd(md))
  const js = fs.readFileSync(`./${snippet}`, 'utf8')

  append_target(`\n
// ${id}
const ${name} = () => 
  div(
    html(\`${body}\`),
  `)
  if (js !== "") {
      append_target(`
    h4('code'),
    pre(code({class: 'language-javascript'}, \`${escape(js)}\`)),
    h4('result'),
    div({id: '${id}', class: 'example'})
      `)
  }
  append_target(`
  )
  add(document.body, ${name}())
  \n`)
  if (js !== "") {
      append_target(`\n;( () => {\n${js.split('\n').slice(3).join('\n')}\n} )()\n`)
  }
}

add_md('./footer.md')