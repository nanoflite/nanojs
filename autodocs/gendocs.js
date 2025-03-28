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

const get_md_as_html = (filename) => {
  const md = fs.readFileSync(path.join(docs, filename), 'utf8')
  const body = escape(marked.parse(md))
  return body
}

const add_md = (filename) => {
  const body = get_md_as_html(filename)
  append_target(`\n// ${filename}\nadd(document.body, html(\`${body}\`))\n`)
}

shell.rm('-rf', build_folder)
shell.mkdir('-p', build_folder)
shell.cp('-r', path.join(root, 'nanojs'), build_folder)
shell.cp(path.join(root, 'style', 'nano.css'), build_folder)
shell.cp(path.join(__dirname, 'index.html'), build_folder)

append_target(`import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from './nanojs/index.mjs'\n`)
append_target(`const { span, a, hr, div, p, ul, li, h1, h2, h3, h4, pre, code, button, input, sup, script } = tags()\n`)

append_target(`
const menu = [ '#home', '#docs', '#source' ]

const Menu = (menu) => {
    return div(
        menu.flatMap(path => [ a({href: path}, path.slice(1).split('/')[0]), span(' | ') ]).slice(0, -1),
        hr()
    )
}

const Header = () => div(
  h1('nJS - A nano sized reactive framework'),
  Menu(menu)
)

const Footer = () => div(
  html(\`${get_md_as_html('footer.md')}\`)
)

const Home = () => div(
  Header(),
  html(\`${get_md_as_html('header.md')}\`),
  Footer()
)
  
const Source = () => div(
  Header(),
  html(\`${get_md_as_html('source.md')}\`),
  Footer()
)

`)

append_target(`

const Docs = () => {
  const examples = []
`)

let i = 0
const snippets = fs.globSync(path.join(snippets_folder, '*.js')).sort()
const fns = []
for (const snippet of snippets) {
  const id = snippet.split('_').pop().replace('.js', '')
  const name = id.charAt(0).toUpperCase() + id.slice(1)
  const md = fs.readFileSync(snippet.replace('.js', '.md'), 'utf8')
  const body = escape(marked.parse(md))
  const js = fs.readFileSync(snippet, 'utf8')
  append_target(`\texamples[${i}] = {}\n`)
  append_target(`\texamples[${i}]['id'] = '${id}'\n`)
  append_target(`\texamples[${i}]['js'] = \`${escape(js.split('\n').slice(4).join('\n'))}\`\n`)
  append_target(`\texamples[${i}]['html'] = \`${body}\`\n`)
  append_target(`\texamples[${i}]['name'] = '${name}'\n`)
  i++
}

append_target(`
  const output = []
  for (const example of examples) {
    output.push(
      div(
        html(example['html']),
        h4('code'),
        pre(code({class: 'language-javascript'}, example['js'])),
        h4('result'),
        div({id: example['id'], class: 'example'})
      )
    ) 
  }
  setTimeout(() => {
    for (const example of examples) {
      eval(example['js'])
    }
  })
  return div(Header(), ...output, Footer())
}

router([
    ['#home', Home],
    ['#docs', Docs],
    ['#source', Source]
  ]
)


`)