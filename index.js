import { state, derive } from './s.mjs'
import { tags, router, sleep, add } from './n.mjs'

const { h1, h2, div, button, input, sup, hr, span, a, li, ul } = tags


const counter = state(0)
const square = derive(_ => counter.value * counter.value)

derive(() => console.log("Counter: ", counter.value))

const menu = [ '#home', '#example', '#derived-state', '#timer/5', "#listdemo", "#test" ]

const Menu = (menu) => {
    return div(
        hr(),
        menu.flatMap(path => [ a({href: path}, path.slice(1).split('/')[0]), span(' | ') ]).slice(0, -1),
        hr()
    )
}

const Header = (page) => div(
    h1("n, a nano size reactive framework."),
    Menu(menu),
    h2(page)
)

const Home = () => div(
    Header('home'),
    div(
        `Welcome to n.js! A minimal reactive framework for building web apps.`
    )
)

const App = () => div(
    Header('example'),
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
    )
)

const DerivedState = () => {
    const text = state("n, nanoJS")
    const length = derive(() => text.value.length)
    return div(
        Header('derived state'),
        span(
            "The length of ",
            input({type: "text", value: text, oninput: e => text.value = e.target.value}),
            " is ", length, ".",
        )
    )
}

const Timer = ({totalSecs}) => {
    const secs = state(totalSecs)
    return div(
        Header('async example'),
        span(' rocket launch in:', secs, "s ",
        button({onclick: async () => {
                while (secs.value > 0) {
                    await sleep(1000)
                    --secs.value
                }
                await sleep(10) // Wait briefly for DOM update
                alert("Launch 🚀")
                secs.value = totalSecs
            }}, "Start")
        )
    )
}

const ListDemo = () => {

    const item = ({text}) => {
        const deleted = state(false)
        return () => deleted.value
                                    ? null
                                    : li(text, a({onclick: () => deleted.value = true}, "❌"))
    }

    const list = ul()
    const text = input({type: "text"})
    return div(
        Header('todo'),
        div(
        "add item: ",
        text,
        " ",
        button(
            {
                onclick: () => {
                    const todo = item({text: text.value})
                    console.log(todo)
                    return add(list, todo)
                }
            },
            "➕"),
        list
        )
    )
}

const Test = () => {
    const item = (text) => {
        const deleted = state(false)
        return () => deleted.value
            ? null
            : li(text, a({onclick: () => deleted.value = true}, "❌"))
    }
    const list = ul()
    return div(
        Header('test'),
        div(
            ul(
                item('A'),
                item('B'),
                item('C'),
                item('D'),
                item('E'),
                item('F'),
                item('G'),
                item('H'),
                item('I'),
                item('J'),
                item('K')
            )
        )
    )
}

router([
    ['#home', Home],
    ['#example', App],
    ['#derived-state', DerivedState],
    ['#timer/:totalSecs', Timer],
    ['#listdemo', ListDemo],
    ['#test', Test]
])