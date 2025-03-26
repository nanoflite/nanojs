import {add, state, tags, derive, component, css, $} from "../nanojs/index.mjs"

const { div, h1, hr, label, input, select, option, style, br, span, button, schedule } = tags()

const styles = css`
    .floating-ui {
        display: flex;
        flex-direction: column;
        position: fixed;
        background-color: white;
        border: 1px solid #333;
        box-shadow: 8px 8px 0;
        z-index: 1000;
        max-width: 500px;
        min-width: 300px;
        margin: 10px;
    }

    .floating-ui .header {
        background-color: #aaa;
        padding: 10px;
        justify-content: space-between;
        cursor: pointer;
    }

    .floating-ui .content {
        overflow: hidden;
    }

    .floating-ui[data-position="bottom-left"] .header {
        order: 2;
    }
    
    .floating-ui[data-position="bottom-right"] .header {
        order: 2;
    }

    .floating-ui[data-position="top-left"] .header {
        order: -1;
    }

    .floating-ui[data-position="top-right"] .header {
        order: -1;
    }
    
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

    .separator {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 20px 0;
        color: #666; /* Text color */
    }

    .separator::before,
    .separator::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #ccc;
        margin: 0 10px;
    }

    .separator span {
        white-space: nowrap;
        padding: 0 10px;
        font-size: 14px;
        color: #666;
    }
`

function config(title, {position = 'top-right', open = false} = {}) {
    const fields = new Map()
    const states = []
    const _config = (...args) => {
        let i = 0
        return new Proxy({},
            {
                get(target, name) {
                    const arg = args[i++]
                    const separators = []
                    while (i < args.length && args[i].type === 'separator') {
                        separators.push(div({class: 'separator'}, span(args[i].label)))
                        i++
                    }
                    const _state = state(arg.default)
                    states.push(_state)
                    let _field
                    switch(arg.type) {
                        case 'bool':
                            _field = bool(name, arg.label, _state)
                            break
                        case 'range':
                            _field = range(name, arg.label, arg.min, arg.max, arg.step, _state)
                            break
                        case 'color':
                            _field = color(name, arg.label, _state)
                            break
                        case 'text':
                            _field = text(name, arg.label, _state)
                            break
                        case 'choice':
                            if (arg.multiple) _state.value = [arg.default]
                            _field = choice(name, arg.label, arg.options, _state, arg.multiple)
                            break
                    }
                    if (separators.length > 0) {
                        _field = div(
                            _field,
                            ...separators
                        )
                    }
                    fields.set(name, _field)
                    return _state
                }
            }
        )
    }
    _config.dom = component('config-ui', (args, root) => {
        const openState = state(open)
        return [
            style(styles),
            div({class: 'floating-ui', 'data-position': position},
                div({   class: "header",
                        onclick: () => openState.value = !openState.value
                    },
                    span(title),
                    span({style: 'float: right;'}, () => openState.value ? '▲' : '▼')
                ),
                div({class: "content", style: () => `display: ${openState.value ? 'block' : 'none'}`},
                    ...Array.from(fields.values())
                )
            )
        ]
    })
    return _config
}

// options is a map (value: desc)
function choice(name, labl, options, value, multiple = false) {
    const _options = []
    for (const [key, val] of Object.entries(options)) {
        const _option = option({value: key}, val)
        if (val === value.value) _option.setAttribute('selected', true)
        _options.push(_option)
    }
    const _select = select({name: name, oninput: (e) => {
        const selectedValues = Array.from(e.target.selectedOptions).map(o => o.value)
        value.value = multiple ? selectedValues : selectedValues[0]
    }}, _options)
    if (multiple) {
        _select.setAttribute('multiple', true)
        _select.setAttribute('size', _options.length > 4 ? 4 : _options.length)
    }
    return div(
        label({for: name}, name),
        _select
    )
}

function text(name, labl, value) {
    return div(
        label({for: name}, labl),
        input({type: "text", name: name, value: value, oninput: (e) => value.value = e.target.value})
    )
}

function bool(name, labl, value) {
    return div(
        label({for: name}, labl),
        input({
                type: "checkbox",
                name: name,
                checked: (e, attr) => {
                    e.checked = value.value
                },
                onchange: (e) => value.value = e.target.checked})
    )
}

function range(name, labl, min, max, step, value) {
    return div(
        label({for: name}, labl),
        input({
            type: "range",
            name: name,
            min: min,
            max: max,
            step: step,
            value: value.value,
            oninput: (e) => value.value = e.target.value
        }),
        span({style: () => `margin-left: 10px`}, value)
    )
 }

 function color(name, labl, value) {
    return div(
        label({for: name}, labl),
        input({
            type: "color",
            name: name,
            value: value.value,
            oninput: (e) => value.value = e.target.value
        })
    )
 }

export { config, color, range, bool, text, choice }