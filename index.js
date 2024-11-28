import { tags, add, schedule, state, bind, derive } from './n.js'

const { h1, div, button, input, sup } = tags

const counter = state(0)
const square = derive(_ => counter.value * counter.value)

const App = () => div(
    h1('Hello World'),
    div({ style: "background-color: grey; color: white; padding: 10px; border-radius: 10px;"},
        div("counter: ", counter),
        div("square:", counter, sup(2),'=', square),
        button({ onclick: () => counter.value++ }, 'inc'),
        button({ onclick: () => counter.value-- }, 'dec'),
        button({ onclick: () => counter.value = 0 }, 'reset')
    ),

    // TODO:
    // 1. property
    input({type: "number", value: counter, disabled: true}),
    // 2. state-derived property
    div({style: () => `font-size: ${8 + counter.value}px;`}, "Hello"),
    // 3. state-derived child
    div(counter, sup(2), () => ` = ${square.value}`)
)

add(document.body, App())
