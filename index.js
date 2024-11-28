import { tags, add, schedule, state, bind, derive } from './n.js'

const { h1, h2, div, button, input, sup, hr, span } = tags

const counter = state(0)
const square = derive(_ => counter.value * counter.value)

derive(() => console.log("Counter: ", counter.value))

const App = () => div(
    h1('n, a nano size reactive framework.'),
    div({ style: "background-color: grey; color: white; padding: 10px; border-radius: 10px;"},
        h2('state'),
        div("counter: ", counter),
        h2('derived state'),
        div("square:", counter, sup(2),'=', square),
        h2('property'),
        input({type: "number", value: _ => counter.value, disabled: true}),
        h2('state-derived property'),
        div({style: () => `font-size: ${8 + counter.value}px;`}, "Hello"),
        h2('state-derived child'),
        div(counter, sup(2), () => ` = ${square.value}`),
        hr(),
        button({ onclick: () => counter.value++ }, 'inc'),
        button({ onclick: () => counter.value-- }, 'dec'),
        button({ onclick: () => counter.value = 0 }, 'reset')
    ),


)

add(document.body, App())

const DerivedState = () => {
    const text = state("n, nanoJS")
    const length = derive(() => text.value.length)
    return span(
        "The length of ",
        input({type: "text", value: text, oninput: e => text.value = e.target.value}),
        " is ", length, ".",
    )
}

add(document.body, DerivedState())

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const Timer = ({totalSecs}) => {
    const secs = state(totalSecs)
    return div(
        span(
        secs, "s ",
        button({onclick: async () => {
                while (secs.value > 0) {
                    await sleep(1000)
                    --secs.value
                }
                await sleep(10) // Wait briefly for DOM update
                alert("⏰: Time is up")
                secs.value = totalSecs
            }}, "Start")
        )
    )
}

add(document.body, Timer({totalSecs: 5}))

