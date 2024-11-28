// reactive state
// state / bind / derive


const state = (initialValue) => {
    let value = initialValue

    const listeners = new Set()

    const notify = () => {
        for (const listener of listeners) {
            listener(value)
        }
    }

    const fn = (newValue) => {
        if (arguments.length > 0 && newValue !== value) {
            value = newValue
            notify()
        }
        return value
    }

    fn.listeners = listeners
    fn.isState = true

    return fn
}

const derive = (fn) => {
    const derived = state(fn())
    fn()
    return derived
}

const bind = (state, fn) => {
    state.listeners.add(fn)
    fn(state())
}

export { state, derive, bind }