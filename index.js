import { state, derive } from './s.mjs'
import { tags, add } from './d.mjs'
import { router } from './r.mjs'
import { sleep } from './u.mjs'
import { component } from "./c.mjs"

const { h1, h2, div, button, input, sup, hr, span, a, li, ul } = tags()
const { svg, circle } = tags('http://www.w3.org/2000/svg')
const { math, mfrac, mi, mn, mo, mrow, msqrt, msup } = tags('http://www.w3.org/1998/Math/MathML')

const counter = state(0)
const square = derive(_ => counter.value * counter.value)

derive(() => console.log("Counter: ", counter.value))

const menu = [ '#home', '#example', '#derived-state', '#timer/5', "#listdemo", "#test", "#component", "#svg", '#math' ]

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

const Component = () => {
    const zero = component('nano-zero')
    const one = component('nano-one', (args) => h1(`I am ${args.name} component!`))
    const app = component('nano-app', (args) => {
        const start = args.start || 0
        const counter = state(start)
        return div(
            "counter: ", counter, button({onclick: () => counter.value++}, "inc"), button({onclick: () => counter.value--}, "dec")
        )
    })
    return div(
        Header('component'),
        div(
            zero(),
            one({name: 'one'}),
            one({name: 'two'}),
            app(),
            app(13)
        )
    )
}

const Svg = () => {
    const colors = ['red', 'green', 'blue']
    const color = state(0)
    return div(
        Header('svg'),
        div(
            svg(
                circle({ cx: 50, cy: 50, r: 40, fill: _ => colors[color.value] })
            )
        ),
        div(
            button({onclick: () => {
                color.value = (color.value + 1) % colors.length
            }}, "change color")
        )
    )
}

const Math = () => div(
    Header('math'),
    div(
        math({ display: "block" },
            mrow(
                mi(
                    "x",
                ),
                mo(
                    "=",
                ),
                mfrac(
                    mrow(
                        mrow(
                            mo(
                                "−",
                            ),
                            mi(
                                "b",
                            ),
                        ),
                        mo(
                            "±",
                        ),
                        msqrt(
                            mrow(
                                msup(
                                    mi(
                                        "b",
                                    ),
                                    mn(
                                        "2",
                                    ),
                                ),
                                mo(
                                    "−",
                                ),
                                mrow(
                                    mn(
                                        "4",
                                    ),
                                    mo(
                                        "⁢",
                                    ),
                                    mi(
                                        "a",
                                    ),
                                    mo(
                                        "⁢",
                                    ),
                                    mi(
                                        "c",
                                    ),
                                ),
                            ),
                        ),
                    ),
                    mrow(
                        mn(
                            "2",
                        ),
                        mo(
                            "⁢",
                        ),
                        mi(
                            "a",
                        ),
                    ),
                ),
            ),
        )

    )
)

router([
    ['#home', Home],
    ['#example', App],
    ['#derived-state', DerivedState],
    ['#timer/:totalSecs', Timer],
    ['#listdemo', ListDemo],
    ['#test', Test],
    ['#component', Component],
    ['#svg', Svg],
    ['#math', Math]
])

