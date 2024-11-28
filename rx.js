// reactivity

const schedule = f => setTimeout(f, 0)

// const state = (initialValue) => {
//     const listeners = new Set()
//     let value = initialValue
//     const _state = (newValue) => {
//         if (newValue === undefined) return value
//         value = newValue
//         schedule(() => {
//             for (let listener of listeners) {
//                 listener()
//             }
//         })
//         return value
//     }
//     _state.listeners = listeners
//     return _state
// }
//
// const stateproto = {
//
// }

// const statex = (initialValue) => {
//     const listeners = new Set()
//     notify = () => {
//         schedule(() => {
//             for (let listener of listeners) {
//                 listener()
//             }
//         })
//     }
//     let value = initialValue
//     const _state = (newValue) => {
//         if (newValue === undefined) return value
//         value = newValue
//         notify()
//     }
//     _state.listeners = listeners
//     _state.__proto__ = {
//         get() {
//             return value
//         },
//         set(newValue) {
//             value = newValue
//             notify()
//         }
//     }
//     return _state
// }

// const statex = (initialValue) => {
//     let value = initialValue
//     return {
//         get() {
//         },
//         set(newValue) {
//             value = newValue
//         }
//     }
// }

function state(initialValue) {
    const listeners = new Set()
    function notify() {
        for (let listener of listeners) {
            listener()
        }
    }
    let value = initialValue

    const fn = function (newValue) {
        if (arguments.length > 0) {
            value = newValue
            notify()
        }
        return value
    }
    fn.listeners = listeners

    return new Proxy(fn, {
        get(target, prop) {
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
        },

    })

    return _state
}

const derive = (state, fn) => {
    return () => fn(state())
}

const bind = (state, fn) => {
   state.listeners.add(fn)
   return fn()
}

const counter = state(42)
const derived = derive(counter, (c) => c + 1)

bind(counter, () => {
    console.log('counter: ', counter())
})

counter(12)
console.log(`var --> ${counter}`)
console.log(`fun --> ${counter()}`)
console.log(`val --> ${counter.value}`)

counter.value = 13

counter.value++

bind(counter, () => {
    schedule(() => {
        console.log('scheduled:')
        console.log('  counter: ', counter())
        console.log('  derived: ', derived())
    })
})

counter(43)

