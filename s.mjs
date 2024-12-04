// state, derive, watch, model, model.json()

const dependingMap = new Map()
const queuedDerives = new Set()

let activeDependingSet = null
let activeDepending = null

const schedule = f => Promise.resolve().then(f)

function state(initialValue) {
    return new Proxy(
       {
           value: initialValue,
           oldValue: null
        },
    {
       get(target, property, receiver) {
           if (property === '__isState') return true
           if (property === 'value') {
               findDepending(target)
           }
           return Reflect.get(target, property, receiver)
       },
       set(target, property, value, receiver) {
           if (property === 'value') {
               if (target.value !== value) {
                   target.oldValue = target.value
                   const reflect = Reflect.set(target, property, value, receiver)
                   updateDepending(target)
                   return reflect
               }
           }
           return Reflect.set(target, property, value, receiver)
       }
    })
}

const toJsonProto = {
    json() {
        const _json = (o) => {
            if (o === null || o === undefined) {
                return o
            }
            else if (Array.isArray(o)) {
                const j = []
                for (let i = 0; i < o.length; ++i) {
                    j[i] = _json(o[i])
                }
                return j
            } else if (o.__isState) {
                return _json(o.value)
            } else if (typeof o === 'object') {
                const j = {}
                for (const [key, value] of Object.entries(o)) {
                    j[key] = _json(value)
                }
                return j
            } else {
                return o
            }
        }
        return _json(this)
    }
}

function model(obj) {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('model: argument must be an object')
    }

    function wrap(obj, path = '') {
        const mobj = {}
        if (Array.isArray(obj)) {
            return state(obj)
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const fullPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    const wrapped = wrap(value, fullPath)
                    mobj[key] = state(wrapped)
                } else {
                    mobj[key] = state(value)
                }
            }
        }
        return mobj
    }

    const m = wrap(obj, '');
    Object.setPrototypeOf(m, toJsonProto)
    return m
}

function watch(fn) {
   activeDependingSet = new Set()
    activeDepending = fn
    fn()
    for (const state of activeDependingSet) {
        if (!dependingMap.has(state)) {
            dependingMap.set(state, new Set())
        }
        dependingMap.get(state).add(activeDepending)
    }
    activeDepending = null
    activeDependingSet = null
}

function findDepending(state) {
    if (!activeDepending) return
    activeDependingSet.add(state)
}

function updateDepending(state) {
    if (dependingMap.has(state)) {
        const derives = dependingMap.get(state)
        for (const derive of derives) {
            queuedDerives.add(derive)
        }
    }
    schedule(() => {
        for (const derive of queuedDerives) {
            derive()
        }
        queuedDerives.clear()
    })
}

function derive(fn) {
    const derived = state(fn())
    watch(() => {
        derived.value = fn()
    })
    return derived
}

export { state, watch, derive, model, schedule }