// TODO:
//  v copy test.html as the index.html
//  v copy nanojs/*, nano.css on build
//  v generate build/index.js
//  v nodemon --> watch
//  v gendocs2 --> gendocs
//  generate menu + router (home (mole?), docs, about, link to github)
//  v use another md converter (marked)
//  v prettier on output

const fs = require('fs')
const path = require('path')
const marked = require('marked')
const shell = require('shelljs')

const build_folder = path.join(__dirname, 'build')
const root = path.join(__dirname, '..')
const docs = path.join(__dirname, 'docs')
const snippets_folder = path.join(__dirname, 'snippets')
const target = path.join(build_folder, 'index.js')

const append = (filename, txt) => {
  fs.appendFileSync(filename, txt)
}

const append_target = (txt) => {
  append(target, txt)
}

const escape = (txt) => txt.replaceAll('`', '\\`').replaceAll('$', '\\$')

const add_md = (filename) => {
  const md = fs.readFileSync(path.join(docs, filename), 'utf8')
  const body = escape(marked.parse(md))
  append_target(`\n// ${filename}\nadd(document.body, html(\`${body}\`))\n`)
}

shell.rm('-rf', build_folder)
shell.mkdir('-p', build_folder)
shell.cp('-r', path.join(root, 'nanojs'), build_folder)
shell.cp(path.join(root, 'style', 'nano.css'), build_folder)
shell.cp(path.join(__dirname, 'index.html'), build_folder)

append_target(`import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from './nanojs/index.mjs'\n`)
append_target(`const { div, p, ul, li, h4, pre, code, button, input, sup } = tags()\n`)
add_md('./header.md')

const snippets = fs.globSync(path.join(snippets_folder, '*.js')).sort()
for (const snippet of snippets) {
  const id = snippet.split('_').pop().replace('.js', '')

  const name = id.charAt(0).toUpperCase() + id.slice(1)
  const md = fs.readFileSync(snippet.replace('.js', '.md'), 'utf8')
  const body = escape(marked.parse(md))
  const js = fs.readFileSync(snippet, 'utf8')

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

add_md('footer.md')