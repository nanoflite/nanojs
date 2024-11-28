/*
 * nano... a micro reactive framework
 *
 * derive(fn) --> state
 *
 *
 *
 */

import { e, s } from './n.js'

const { h1, div, button, input, sup } = e.html // e.svg, e.math, e.ns()

const { state, bind, derive } = s

const counter = state(4)
derive(() => console.log(`Counter: ${counter.value}`))
const counterSquared = derive(() => counter.value * counter.value, 'SQUARED')
const dom1 = div(counter)
const dom2 = input({type: "number", value: counter, disabled: true})
const dom3 = div({style: () => `font-size: ${counter.value}em;`}, "Text")
const dom4 = div(counter, sup(2), ' = ', counterSquared)

const incrementBtn = button({onclick: () => ++counter.value}, "Increment")
const resetBtn = button({onclick: () => counter.value = 1}, "Reset")

bind(counterSquared, () => {
    console.log(`==> SQUARE: ${counterSquared.value}`)
})

counterSquared(counterSquared.value + 1)

// const App = () => div({ style: "background-color: grey; color: white; padding: 10px; border-radius: 10px;"},
//     h1('Hello World: ', counter),
//     button({ onclick: () => counter.value++ }, 'click me')
// )

// e.add(document.body, App())
e.add(document.body, incrementBtn, resetBtn, dom1, dom2, dom3)

e.add(document.body, dom4)
