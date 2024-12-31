// Utilities: sleep, schedule, css

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const schedule = f => Promise.resolve().then(f)

const css = (strings, ...values) => {
    return strings.raw.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
}

const $ = (selector, context = document) => {
    const elements = (context.shadowRoot ?? context).querySelectorAll(selector)
    return new Proxy(elements, {
        get(target, prop, receiver) {
            if (prop === 'css') {
                return (property, value) => {
                    target.forEach(el => (el.style[property] = value))
                    return target
                }
            }
            if (prop === 'on') {
                return (event, handler) => {
                    target.forEach(el => el.addEventListener(event, handler))
                    return target
                }
            }
            if (target.length === 1) return target[0][prop]
            return Array.from(target).map(el => el[prop])
        },
        set(target, prop, value) {
            target.forEach(el => (el[prop] = value))
            return true
        }
    })
}

export { sleep, schedule, css, $ }