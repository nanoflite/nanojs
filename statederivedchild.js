import {tags, add, state, derive } from './nanojs/index.mjs'

const { div, button, sup } = tags()

const counter = state(0)
const square = derive(_ => Math.pow(counter.value, 2))

add(document.body, div(
    div(counter, sup(2), ' = ', square),
    div(counter, sup(3), ' = ', () => Math.pow(counter.value, 3)),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))
