import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from './nanojs/index.mjs'
const { div, p, ul, li, h4, pre, code } = tags()

// ./header.md
add(document.body, html(`<h1>nJS - A nano sized reactive framework</h1>

<p><i>nJS</i> is a lightweight framework designed to provide essential reactive programming features for web applications. Its minimalistic approach allows developers to efficiently manage state and DOM updates with simplicity and ease.</p>

<p>These are interactive docs... enjoy</p>

<hr/>`))


// helloworld
const Helloworld = () => 
  div(
    html(`<h2>Hello World</h2>

<p>Checkout this \`Hello World\` example in <i>nJS</i>. </p>
`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import { add, tags, S} from './nanojs/index.mjs'

const { div, p } = tags()

add(S('#helloworld'), div(p('Hello World!')))
`)),
    h4('example'),
    div({id: 'helloworld', class: 'example'})
      
  )
  add(document.body, Helloworld())
  

;( () => {

add(S('#helloworld'), div(p('Hello World!')))

} )()


// tags
const Tags = () => 
  div(
    html(`<h2>Tags</h2>

<p>Tags can be imported from the \`tags\` function, whereby each tag is a function that takes a list of other tags or text.</p>

<p>There's a minimal selector function \`S\` available as well. Look at it as a replacement for the \`$\` fucntion in jQuery, but simpler.</p>

<p>The \`add\` function can be used to add a list of (nested) children to a DOM element (e.g. \`document.body\`).</p>`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import {add, tags, S} from './nanojs/index.mjs'

const { div, p, ul, li  } = tags()

add(S('#tags'), div(p('Hello World!'), ul(li('a'), li('b'), li('c'))))
`)),
    h4('example'),
    div({id: 'tags', class: 'example'})
      
  )
  add(document.body, Tags())
  

;( () => {

add(S('#tags'), div(p('Hello World!'), ul(li('a'), li('b'), li('c'))))

} )()


// state
const State = () => 
  div(
    html(`<h2>State</h2>

<p>State is simply defined as a call to the function \`state\`. The value of a state can be any primitive javascript type.</p>

<p>You can access the value of state by using the \`value\` property.</p>`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import { tags, add, state, S } from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

add(S('#state'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))`)),
    h4('example'),
    div({id: 'state', class: 'example'})
      
  )
  add(document.body, State())
  

;( () => {

const counter = state(0)

add(S('#state'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))
} )()


// derived
const Derived = () => 
  div(
    html(`<h2>Derived state</h2>

<p>State can be derived from another state variable, using the \`derive\` function.</p>

`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import {tags, add, state, derive, S} from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

const square = derive(_ => counter.value * counter.value)

add(S('#derived'), div(
    p("Counter: ", counter),
    p("Square: ", square),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))`)),
    h4('example'),
    div({id: 'derived', class: 'example'})
      
  )
  add(document.body, Derived())
  

;( () => {

const counter = state(0)

const square = derive(_ => counter.value * counter.value)

add(S('#derived'), div(
    p("Counter: ", counter),
    p("Square: ", square),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))
} )()


// stateproperty
const Stateproperty = () => 
  div(
    html(`<h2>A property can depend on state</h2>

<p>You can set the value of a property to a state variable.</p>

`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import {tags, add, state, S} from './nanojs/index.mjs'

const { div, p, input, button } = tags()

const counter = state(0)

add(S('#stateproperty'), div(
    p("Counter: ", counter),
    input({type: "number", value: counter, disabled: true}),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))`)),
    h4('example'),
    div({id: 'stateproperty', class: 'example'})
      
  )
  add(document.body, Stateproperty())
  

;( () => {

const counter = state(0)

add(S('#stateproperty'), div(
    p("Counter: ", counter),
    input({type: "number", value: counter, disabled: true}),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))
} )()


// statederivedproperty
const Statederivedproperty = () => 
  div(
    html(`<h2>A property can be derived from state</h2>

<p>If we set the value of a property to be a function, we can use derived state as the value of that property.</p>
`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import {tags, add, state, S} from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

add(S('#statederivedproperty'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
    p({style: () => \`font-size: ${8 + counter.value}pt;\`}, "Hello!")
))
`)),
    h4('example'),
    div({id: 'statederivedproperty', class: 'example'})
      
  )
  add(document.body, Statederivedproperty())
  

;( () => {

const counter = state(0)

add(S('#statederivedproperty'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
    p({style: () => `font-size: ${8 + counter.value}pt;`}, "Hello!")
))

} )()


// statederivedchild
const Statederivedchild = () => 
  div(
    html(`<h2>Derived child node</h2>

<p>A child node can be a derived state variable. Alternatively, we can use a function as a child node.</p>
`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import {tags, add, state, derive, S} from './nanojs/index.mjs'

const { div, button, sup } = tags()

const counter = state(0)
const square = derive(_ => Math.pow(counter.value, 2))

add(S('#statederivedchild'), div(
    div(counter, sup(2), ' = ', square),
    div(square, sup(3), ' = ', () => Math.pow(square.value, 3)),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))
`)),
    h4('example'),
    div({id: 'statederivedchild', class: 'example'})
      
  )
  add(document.body, Statederivedchild())
  

;( () => {

const counter = state(0)
const square = derive(_ => Math.pow(counter.value, 2))

add(S('#statederivedchild'), div(
    div(counter, sup(2), ' = ', square),
    div(square, sup(3), ' = ', () => Math.pow(square.value, 3)),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))

} )()


// change
const Change = () => 
  div(
    html(`<h2>Execute code when state changes</h2>

<p>There are 3 ways to execute code when state changes: \`watch\`, \`derive\` and \`change\`.</p>

<p>We already discussed \`derive\`, which return a new state that depends on another state.</p>`),
  
  )
  add(document.body, Change())
  


// watch
const Watch = () => 
  div(
    html(`<h3>watch</h3>

<p>Watch works like derive, but does not return a state. It can be used to run a piece of code anytime a state is assigned a value.</p>

<p>The \`setTimeout\` in the alert watcher is necessary to let the UI update before the alert is shown.</p>`),
  
    h4('code'),
    pre(code({class: 'language-javascript'}, `import {tags, add, state, watch, S} from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

watch(() => {
    if (counter.value === 3) {
        setTimeout(() => alert(\`Counter reached 3!\`), 0)
    }
})

watch(() => {
    console.log(\`Counter: ${counter.value}\`)
})

add(S('#watch'), div(
    p("Counter: ", counter),
    p("(increment till 3)"),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))`)),
    h4('example'),
    div({id: 'watch', class: 'example'})
      
  )
  add(document.body, Watch())
  

;( () => {

const counter = state(0)

watch(() => {
    if (counter.value === 3) {
        setTimeout(() => alert(`Counter reached 3!`), 0)
    }
})

watch(() => {
    console.log(`Counter: ${counter.value}`)
})

add(S('#watch'), div(
    p("Counter: ", counter),
    p("(increment till 3)"),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))
} )()

// ./footer.md
add(document.body, html(`<hr/>

<p>(c) 2025 - JVdB</p>`))
