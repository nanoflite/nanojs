import {add, tags, derive } from "./nanojs"
const { div, h1, br, span } = tags()

import { config } from './config.js'

// example
const params = config('settings', { position: 'top-right', open: false}   )
const { activate, temperature, colour, name, chooseone, choosemultiple } = params(
    {type: 'bool', label: 'Activate:', default: true},
    {type: 'range', label: 'Temperature:', default: 50, min: 0, max: 100, step: 1},
    {type: 'separator', label: 'rest'},
    {type: 'color', label: 'Color:', default: '#ff8800'},
    {type: 'text', label: 'Name:', default: 'John'},
    {type: 'choice', label: 'Toppings:', default: 'butter', options: {butter: 'Butter', choklat: 'Choklat', dust: 'Dust'}},
    {type: 'choice', label: 'Breakfast:', default: 'eggs', options: {eggs: 'Eggs', spam: 'Spam', bacon: 'Bacon'}, multiple: true}
)

derive(()=>{
    console.log(`--> activate: ${activate.value}`)
    console.log(`--> temperature: ${temperature.value}`)
})

add(document.body, params.dom())
add(document.body, () => div(
        h1('Hello World'),
        span(`Am I activated? ${activate.value ? 'Yes' : 'No'}`),
        br(),
        span(`Oh boy, so hot: ${temperature.value}`),
        br(),
        span(`Oh boy, so colorful: ${colour.value}`),
        br(),
        span({style: () => `background-color: ${colour.value}`}, "color"),
        br(),
        span(`My name is ${name.value}`),
        br(),
        span(`I like ${chooseone.value}`),
        br(),
        span(`I like ${choosemultiple.value.join(', ')}`)
    )
)
