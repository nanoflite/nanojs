import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from './nanojs/index.mjs'
const { span, a, hr, div, p, ul, li, h1, h2, h3, h4, pre, code, button, input, sup, script, iframe } = tags()

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

const Footer = () => {
  setTimeout(_ => hljs.highlightAll(), 0)
  return div(html(`<hr>
<p>(c) 2024 - 2025 - JVdB</p>
`))
}

const Home = () => div(
  Header(),
  html(`<p><strong>nanojs</strong> is a lightweight, functional framework for building reactive web applications.</p>
<h2>Features</h2>
<ul>
<li>Zero build step</li>
<li>Reactive state management</li>
<li>Declarative DOM creation and updates</li>
<li>Utilities like <code>sleep</code>, <code>schedule</code>, <code>S()</code> selector, and more</li>
</ul>
<h2>Example</h2>
`),
  pre(code(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>nJS example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nanoflite/nanojs@1.0.0/dist/nano.css"/>
</head>
<body>
<script type="module">
    import { add, tags } from 'https://cdn.jsdelivr.net/gh/nanoflite/nanojs@1.0.0/dist/nanojs.mjs'
    const { h1 } = tags()
    add(document.body, h1('Hello World!'))
</script>
</body>
</html>`)),
  iframe({srcdoc: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>nJS example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nanoflite/nanojs@1.0.0/dist/nano.css"/>
</head>
<body>
<script type="module">
    import { add, tags } from 'https://cdn.jsdelivr.net/gh/nanoflite/nanojs@1.0.0/dist/nanojs.mjs'
    const { h1 } = tags()
    add(document.body, h1('Hello World!'))
</script>
</body>
</html>`}), 
  Footer()
)

const Source = () => div(
  Header(),
  html(`<h2>CDN</h2>
<pre><code>import { ... } from &#39;https://cdn.jsdelivr.net/gh/nanoflite/nanojs@latest/dist/nanojs.mjs&#39;
</code></pre>
<h2>Github</h2>
<ul>
<li><a href="https://github.com/nanoflite/nanojs">nanojs github repository</a></li>
</ul>
`),
  Footer()
)



const Docs = () => {
  const examples = []
	examples[0] = {}
	examples[0]['id'] = 'helloworld'
	examples[0]['js'] = `add(S('#helloworld'), div(p('Hello World!')))
`
	examples[0]['html'] = `<h2>Hello World</h2>
<p>Checkout this <code>Hello World</code> example in <em>nJS</em>. </p>
`
	examples[0]['name'] = 'Helloworld'
	examples[1] = {}
	examples[1]['id'] = 'tags'
	examples[1]['js'] = `add(S('#tags'), div(p('Hello World!'), ul(li('a'), li('b'), li('c'))))
`
	examples[1]['html'] = `<h2>Tags</h2>
<p>Tags can be imported from the <code>tags</code> function, whereby each tag is a function that takes a list of other tags or text.</p>
<p>There&#39;s a minimal selector function <code>S</code> available as well. Look at it as a replacement for the <code>\$</code> fucntion in jQuery, but simpler.</p>
<p>The <code>add</code> function can be used to add a list of (nested) children to a DOM element (e.g. <code>document.body</code>).</p>
`
	examples[1]['name'] = 'Tags'
	examples[2] = {}
	examples[2]['id'] = 'state'
	examples[2]['js'] = `const counter = state(0)

add(S('#state'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))`
	examples[2]['html'] = `<h2>State</h2>
<p>State is simply defined as a call to the function <code>state</code>. The value of a state can be any primitive javascript type.</p>
<p>You can access the value of state by using the <code>value</code> property.</p>
`
	examples[2]['name'] = 'State'
	examples[3] = {}
	examples[3]['id'] = 'derived'
	examples[3]['js'] = `const counter = state(0)

const square = derive(_ => counter.value * counter.value)

add(S('#derived'), div(
    p("Counter: ", counter),
    p("Square: ", square),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))`
	examples[3]['html'] = `<h2>Derived state</h2>
<p>State can be derived from another state variable, using the <code>derive</code> function.</p>
`
	examples[3]['name'] = 'Derived'
	examples[4] = {}
	examples[4]['id'] = 'stateproperty'
	examples[4]['js'] = `const counter = state(0)

add(S('#stateproperty'), div(
    p("Counter: ", counter),
    input({type: "number", value: counter, disabled: true}),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))`
	examples[4]['html'] = `<h2>A property can depend on state</h2>
<p>You can set the value of a property to a state variable.</p>
`
	examples[4]['name'] = 'Stateproperty'
	examples[5] = {}
	examples[5]['id'] = 'statederivedproperty'
	examples[5]['js'] = `const counter = state(0)

add(S('#statederivedproperty'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
    p({style: () => \`font-size: \${8 + counter.value}pt;\`}, "Hello!")
))
`
	examples[5]['html'] = `<h2>A property can be derived from state</h2>
<p>If we set the value of a property to be a function, we can use derived state as the value of that property.</p>
`
	examples[5]['name'] = 'Statederivedproperty'
	examples[6] = {}
	examples[6]['id'] = 'statederivedchild'
	examples[6]['js'] = `const counter = state(0)
const square = derive(_ => Math.pow(counter.value, 2))

add(S('#statederivedchild'), div(
    div(counter, sup(2), ' = ', square),
    div(square, sup(3), ' = ', () => Math.pow(square.value, 3)),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))
`
	examples[6]['html'] = `<h2>Derived child node</h2>
<p>A child node can be a derived state variable. Alternatively, we can use a function as a child node.</p>
`
	examples[6]['name'] = 'Statederivedchild'
	examples[7] = {}
	examples[7]['id'] = 'change'
	examples[7]['js'] = ``
	examples[7]['html'] = `<h2>Execute code when state changes</h2>
<p>There are 3 ways to execute code when state changes: <code>watch</code>, <code>derive</code> and <code>change</code>.</p>
<p>We already discussed <code>derive</code>, which return a new state that depends on another state.</p>
`
	examples[7]['name'] = 'Change'
	examples[8] = {}
	examples[8]['id'] = 'watch'
	examples[8]['js'] = `const counter = state(0)

watch(() => {
    if (counter.value === 3) {
        setTimeout(() => alert(\`Counter reached 3!\`), 0)
    }
})

watch(() => {
    console.log(\`Counter: \${counter.value}\`)
})

add(S('#watch'), div(
    p("Counter: ", counter),
    p("(increment till 3)"),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))`
	examples[8]['html'] = `<h3>watch</h3>
<p>Watch works like derive, but does not return a state. It can be used to run a piece of code anytime a state is assigned a value.</p>
<p>The <code>setTimeout</code> in the alert watcher is necessary to let the UI update before the alert is shown.</p>
`
	examples[8]['name'] = 'Watch'

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


