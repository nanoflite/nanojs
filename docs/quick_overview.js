import { state, derive, tags, add, S } from './nanojs'

const { hr, h3, div, button, input, sup } = tags()

const counter = state(0)
const square = derive(_ => counter.value * counter.value)

derive(() => console.log("Counter: ", counter.value))

const QuickOverview = () => div(
    div(
        h3('state'),
        div("counter: ", counter),
        h3('derived state'),
        div("square:", counter, sup(2),'=', square),
        h3('property'),
        input({type: "number", value: _ => counter.value, disabled: true}),
        h3('state-derived property'),
        div({style: () => `font-size: ${8 + counter.value}px;`}, "Hello"),
        h3('state-derived child'),
        div(counter, sup(2), () => ` = ${square.value}`),
        hr(),
        button({ onclick: () => counter.value++ }, 'inc'),
        button({ onclick: () => counter.value-- }, 'dec'),
        button({ onclick: () => counter.value = 0 }, 'reset')
    )
)

add(S('#overview'), QuickOverview)

