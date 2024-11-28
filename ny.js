const proto = Object.getPrototypeOf
const objProto = proto({})
const funProto = proto(proto)
const proxyProto = proto(new Proxy({}, {}))
const isObj = _ => proto(_ ?? 0) === objProto
const isFun = _ => proto(_ ?? 0) === funProto
const isNode = _ => !!(_?.nodeType ?? 0)
const isState = _ => !!(_?.isState ?? false)

const debugDerives = []

const schedule = f => setTimeout(f, 0)

let _derives = []

const statex = (initialValue) => {

    const listeners = new Set()
    const derives = new Set()

    let value = initialValue
    const fn = function (newValue) {
        if (arguments.length > 0) {
            value = newValue
            notify()
        }
        return value
    }
    fn.listeners = listeners
    fn.derives = derives
    fn.isState = true

    const proxy = new Proxy(fn, {
        get(target, prop) {
            _derives?.push(fn)
            if (prop === "valueOf" || prop === Symbol.toPrimitive) {
                return () => value
            }
            if (prop === 'value') {
                return value
            }
            return target[prop]
        },

        set(target, prop, newValue) {
            if (prop === "value") {
                value = newValue
                notify()
                return true
            }
            return false
        }
    })

    const notify = () => {
        for (let listener of listeners) {
            listener(proxy)
        }
    }

    return proxy
}


const makeState = (fn) => {
    const listeners = new Set()
    fn.listeners = listeners
    const derives = new Set()
    fn.derives = derives
    fn.isState = true

    const proxy = new Proxy(fn, {
        get(target, prop) {
            _derives?.push(fn)
            if (prop === "valueOf" || prop === Symbol.toPrimitive) {
                return () => fn()
            }
            if (prop === 'value') {
                return fn()
            }
            return target[prop]
        },

        set(target, prop, newValue) {
            if (prop === "value") {
                fn(newValue)
                notify()
                return true
            }
            return false
        }
    })

    const notify = () => {
        for (let listener of listeners) {
            listener(proxy)
        }
        for (let derive of derives) {
            derive(fn())
        }
    }

    return proxy
}

const state = (initialValue) => {
    let value = initialValue
    const fn = function(newValue) {
        if (arguments.length > 0) {
            value = newValue
        }
        return value
    }
    return makeState(fn)
}

const derive = (fn, name = '') => {
    const state = makeState(fn)
    _derives = []
    try {
        fn()
        _derives.forEach(d => {
            d.derives.add(state)
        })
    } finally {
        _derives = null
    }
    fn.xxname = name
    return state
}

const bind = (state, fn) => {
    state.listeners.add(fn)
    return fn(state)
}

const getDom = (elt) =>
    isNode(elt)
        ? elt
        : isFun(elt)
            ? getDom(elt())
            : new Text(elt)

const add = (dom, ...children) => {
    for (let child of children.flat(Infinity)) {
        if (isState(child)) {
            const span = document.createElement('span')
            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            span.style.backgroundColor = "#" + randomColor;
            const node = document.createTextNode('')
            span.appendChild(node)
            bind(child, () => {
                schedule(_ => {
                    const v = child()
                    if (child.xxname) {
                        console.log(`Schedule for child ${child.xxname}`)
                        console.log(`In schedule got value: ${v}`)
                        console.log('node:', node)
                        console.log(`1. node.textContent: '${node.textContent}'`)
                    }
                    node.textContent = v
                    if (child.xxname) {
                        console.log(`2. node.textContent: '${node.textContent}'`)
                    }
                })
            })
            dom.appendChild(span)
        } else {
            dom.appendChild(getDom(child))
        }
    }
    return dom
}

const e = {

    html: new Proxy({}, {
        get(target, tag) {
            console.log(target, tag)
            return (...args) => {
                const [props, ...children] = isObj(args[0]) ? args : [{}, ...args]
                const elt = document.createElement(tag)
                for (let [prop, value] of Object.entries(props)) {
                    if (isFun(value) && prop.startsWith('on')) {
                        elt.addEventListener(prop.slice(2).toLowerCase(), value)
                    } else
                    if (isFun(value)) {
                        elt.setAttribute(prop, value())
                    } else {
                        elt.setAttribute(prop, value)
                    }
                }
                return add(elt, children)
            }
        }
    }),
    add
}

const s = {
    state,
    bind,
    derive
}

export { e, s }
