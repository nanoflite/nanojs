import {add, state, tags, derive, component, css, $} from "./nanojs"

const { div, h1, hr, label, input, select, option, style, br, span, button } = tags()

const styles = css`
#container {
    border: 1px solid #ccc;
    width: 300px;
    padding: 10px;
}

#header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #f9f9f9;
    padding: 5px;
    border-bottom: 1px solid #ddd;
}

#content {
    padding: 10px;
}

    /* General styles for the floating UI */
    .floating-ui {
        position: fixed;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        z-index: 1000;
        max-width: 300px;
    }

    /* Header styles */
    .floating-ui .header {
        background-color: #f9f9f9;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
    }

    /* Content styles (hidden when collapsed) */
    .floating-ui .content {
        padding: 10px;
        display: none;
    }

    /* Position-specific styles */
    .floating-ui[data-position="top"] {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    .floating-ui[data-position="bottom"] {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    .floating-ui[data-position="left"] {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
    }

    .floating-ui[data-position="right"] {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }

    /* Expanded state */
    .floating-ui.expanded .content {
        display: block;
    }

    /* Collapsed header position adjustments */
    .floating-ui[data-position="bottom"] .header {
        order: 2;
    }

    .floating-ui[data-position="top"] .header {
        order: -1;
    }

    /* Position-specific styles */
    .floating-ui[data-position="top-left"] {
        top: 0;
        left: 0;
    }

    .floating-ui[data-position="top-right"] {
        top: 0;
        right: 0;
    }

    .floating-ui[data-position="bottom-left"] {
        bottom: 0;
        left: 0;
    }

    .floating-ui[data-position="bottom-right"] {
        bottom: 0;
        right: 0;
    }

    .floating-ui[data-position="center"] {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
`
function config(title, {position = 'top-right', open = false} = {}) {
    const fields = new Map()
    const states = []
    const _config = (...args) => {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i]
            switch(arg.type) {
                case 'bool':
                    const _state = state(arg.default)
                    const _field = bool(arg.name, arg.label, _state)
                    fields.set(arg.name, _field)
                    states.push(_state)
                    break
                default:
                    break
            }
        }
        return states
    }
    _config.dom = component('config-ui', (args, root) => {
        return [
            style(styles),
            div({id: 'container', class: 'floating-ui', 'data-position': position},
                div({id:"header", onclick: () => {
                        const uiDiv = $('#content', root)
                        const toggleButton = $('#toggleButton', root)
                        const visible = uiDiv.style.display === 'block'
                        uiDiv.style.display = visible ? 'none' : 'block'
                        toggleButton.textContent = visible ? '▲' : '▼'
                    }},
                    span(title),
                    button({id:"toggleButton"}, open ? '▲' : '▼')
                ),
                div({id:"content", style:`display: ${open ? 'block' : 'none'};`},
                    ...Array.from(fields.values())
                )
            )
        ]
    })
    return _config
}

// function choice(name, options) {
//     return select({name: name}, options.map(option))
// }
// function multiple(name, options) {
//     return select({name: name, multiple: true}, options.map(option))
// }
// function range(name, min, max, step) {
//     return input({type: "range", name: name, min: min, max: max, step: step})
// }
// function text(name, value) {
//     return input({type: "text", name: name, value: value})
// }

function bool(name, labl, value) {
    return div(
        label({for: name}, labl),
        input({
                type: "checkbox",
                name: name,
                checked: (e, attr) => {
                    console.log(`propperdepropperdeprop: ${attr}`);
                    e.checked = value.value
                },
                onchange: (e) => value.value = e.target.checked})
    )
}

// example
const params = config('settings')
const [ activate ] = params(
    {type: 'bool', label: 'Activate:', default: true}
)

//
//const [ toppings, breakfast, temperature, name, activate, font ] = params(
//    choice("toppings", ["butter", "choklat", "dust"]),
//    multiple("breakfast", ["eggs", "spam", "bacon"]),
//    range("temperature", 0, 100, 1),
//    text("name", "John"),
//    bool("activate", true),
//    // font("font", ["Arial", "Helvetica", "Times New Roman"])
//)
//
// const boolState = state(true)
derive(()=>{
    console.log(`--> activate: ${activate.value}`)
})
// const boolField = bool("activate", "Activate: ", boolState)
add(document.body, params.dom())
