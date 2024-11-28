const proto = Object.getPrototypeOf
const objProto = proto({})
const funProto = proto(function() {})
const asyncProto = proto(async function() {})

const isObj = _ => proto(_ ?? 0) === objProto
const isFun = _ => [funProto, asyncProto].includes(proto(_ ?? 0))
const isNode = _ => !!(_?.nodeType ?? 0)
const isState = _ => !!(_?.isState ?? false)

let derives = null

const schedule = f => setTimeout(f, 0)

const getDom = (elt) =>
    isNode(elt)
        ? elt
        : isFun(elt)
            ? getDom(elt())
            : new Text(elt)

const add = (dom, ...children) => {
    for (let child of children.flat(Infinity)) {
        if (isState(child)) {
            const node = document.createTextNode('')
            bind(child, () => {
                node.textContent = child.value
            })
            dom.appendChild(node)
        } else
        if (isFun(child)) {
            const node = document.createTextNode('')
            const derived = derive(child)
            bind(derived, () => {
                node.textContent = child()
            })
            dom.appendChild(node)
        } else {
            dom.appendChild(getDom(child))
        }
    }
    return dom
}

const tags = new Proxy(
    {},
    {
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
                        const derived = derive(value)
                        bind(derived, () => {
                            elt.setAttribute(prop, value())
                        })
                    } else
                    if (isState(value)) {
                        bind (value, () => {
                            elt.setAttribute(prop, value.value)
                        })
                    } else {
                        elt.setAttribute(prop, value)
                    }
                }
                return add(elt, children)
            }
        }
    })

const stateProto = {
    _notify() {
        for (const listener of this.listeners) {
            listener(this._value)
        }
    },
    get value() {
        derives?.add(this)
        return this._value
    },
    get previousValue() {
        return this._previousValue
    },
    set value(newValue) {
        if (this._value === newValue) return
        this._previousValue = this._value
        this._value = newValue
        this._notify()
    }
}

const state = (initialValue) => ({
    __proto__: stateProto,
    _value: initialValue,
    _previousValue: undefined,
    listeners: new Set(),
    isState: true
})

function derive(fn) {
    const derived = state()

    derives = new Set()
    try {
        fn()
        for(const d of derives) {
            console.log(`Got derive`, d)
            d.listeners.add(() => {
                derived.value = fn()
            })
        }
    } finally {
        derives = null
    }

    derived.value = fn()
    return derived
}

const bind = (state, fn) => {
    state.listeners.add(fn)
    schedule( _ => fn(state.value))
}

export { tags, add, schedule, state, derive, bind }