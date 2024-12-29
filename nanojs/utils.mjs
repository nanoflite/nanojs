// Utilities: sleep, schedule, css

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const schedule = f => Promise.resolve().then(f)

const css = (strings, ...values) => {
    return strings.raw.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
}

const $ = (selector, context = document) => {
    const elements = (context.shadowRoot ?? context).querySelectorAll(selector)
    return new Proxy(
        {
            css: (property, value) => {
                elements.forEach(el => (el.style[property] = value))
                return this
            },
            on: (event, handler) => {
                elements.forEach(el => el.addEventListener(event, handler))
                return this
            }
        },
        {
            get(obj, prop) {
                if (prop in obj) return obj[prop]
                const props = Array.from(elements).map(e => e[prop])
                console.log(props)
                console.log(props.length)
                if (props.length === 1) return props[0]
                if (props.length > 1) return props
                return undefined
            }
        }
    )
}

export { sleep, schedule, css, $ }