# nanojs - (dom, state, router, model, component, utils)

*A minimal reactive framework, (some) batteries included*

nanojs is a lightweight framework designed to provide essential reactive programming features for web applications. Its minimalistic approach allows developers to efficiently manage state and DOM updates with simplicity and ease.

## Key Features

- **Reactive State Management**: Easily manage application state with reactive state objects. Changes to the state automatically update the DOM elements bound to them, keeping the user interface in sync with the data.
- **Derived States**: Compute values based on state changes using derived states. This feature helps in efficiently managing computations that depend on multiple reactive states.
- **Component System**: Build reusable and encapsulated components, allowing for well-structured and maintainable code.
- **Declarative DOM Manipulation**: Use functions and reactive expressions to declaratively build and manipulate the DOM. This promotes clean code and reduces boilerplate.
- **Router with Hash-based Navigation**: Includes a simple router for managing hash-based navigation, making it easy to build single-page applications with route handling.
- **Utility Functions**: Handy utility functions like asynchronous sleep and property binding, which simplify common tasks in web development.

## Documentation

# NanoJS Documentation
## Overview
nanojs is a minimalistic reactive framework that simplifies web application development by offering a set of tools for managing state, building components, and interacting with the DOM. It's lightweight, easy to use, and perfectly suited for building modern, reactive user interfaces.
## Table of Contents
1. [Getting Started]()
2. [Core Concepts]()
    - [Reactive State Management]()
    - [Derived States]()
    - [Declarative DOM Manipulation]()

3. [Components]()
4. [Router]()
5. [Utilities]()
6. [Examples]()
7. [API Reference]()

## Getting Started
To start using **nanojs**, follow these steps:
### Installation
You can install **nanojs** via npm:
``` bash
npm install nanojs
```
Or include it directly in your project:
``` html
<script src="your-cdn-link.js"></script>
```
### Basic Example
Here's a simple example of setting up a reactive counter:
``` javascript
import { state, tags, add } from 'nanojs'

const { button, div } = tags() // Access HTML element functions

const counter = state(0) // Create a reactive state

const CounterComponent = () =>
    div(
        div(`Counter: ${_ => counter.value}`), // Reactive data binding
        button({ onclick: () => counter.value++ }, "Increment"),
        button({ onclick: () => counter.value-- }, "Decrement"),
        button({ onclick: () => counter.value = 0 }, "Reset")
    )

add(document.body, CounterComponent()) // Add it to the DOM
```
## Core Concepts
### Reactive State Management
The `state` function in **nanojs** creates reactive state objects that automatically update the DOM when their values change.
``` javascript
const counter = state(0)
counter.value++ // Triggers an update
```
You can bind state values directly in the DOM using expressions:
``` javascript
div(() => `Counter: ${counter.value}`)
```
### Derived States
Derived states are computed values based on one or more existing states. Use the `derive` function for this:
``` javascript
const doubleCounter = derive(() => counter.value * 2)
```
### Declarative DOM Manipulation
**nanojs**'s `tags` provides functions to create and manipulate DOM elements declaratively.
``` javascript
const { div, button } = tags()
div(
    button({ onclick: increment }, "Click Me")
)
```
## Components
Components in **nanojs** are functional and reusable building blocks. Here's how you can create a simple component:
``` javascript
const MyComponent = () =>
    div(
        h1("Hello from MyComponent!"),
        p("This is a paragraph.")
    )

add(document.body, MyComponent())
```
## Router
**nanojs** includes a hash-based router for single-page applications (SPAs). Define routes like this:
``` javascript
import { router } from 'nanojs'

router([
    { path: '/', component: HomeComponent },
    { path: '/about', component: AboutComponent }
])
```
## Utilities
### Asynchronous Sleep
Use the `sleep` function for delays in asynchronous operations:
``` javascript
await sleep(1000) // Waits for 1 second
```
### Other Utilities
- `schedule`: Run tasks at a scheduled time.
- `css`: Add inline styles dynamically.
- `$`: Query DOM elements easily.

## Examples
### Counter with Dynamic Font Size
``` javascript
import { state, derive, tags, add } from 'nanojs'
const { div, button } = tags()

const counter = state(0)
const fontSize = derive(() => 16 + counter.value)

const CounterApp = () =>
    div(
        div({ style: () => `font-size: ${fontSize.value}px` }, `Counter: ${_ => counter.value}`),
        button({ onclick: () => counter.value++ }, "Increase"),
        button({ onclick: () => counter.value-- }, "Decrease")
    )

add(document.body, CounterApp())
```
## API Reference
### State Management
- `state(initialValue: any)`
  Creates a reactive state.
- `states(initialValues: object)`
  Creates multiple states at once.
- `watch(fn: () => void)`
  Watches changes in state and triggers the provided function.

### DOM Builders
- `tags()`
  Provides functions for creating DOM elements (`div`, `button`, `h1`, etc.).
- `add(parent: Element, child: Element | (() => Element))`
  Adds child elements to a parent dynamically.

### Router
- `router(routes: Array<Route>)`
  Defines hash-based routing.

### Utilities
- `sleep(ms: number)`
  Asynchronous delay.
- `css(strings: TemplateStringsArray)`
  Adds CSS styles declaratively.
- `$`
  Provides a DOM query helper.

