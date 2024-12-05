// Reactive state: state, derive, watch,

import { schedule } from "./u.mjs"

const dependingMap = new Map()
const queuedDerives = new Set()

let activeDependingSet = null
let activeDepending = null

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

export { state, watch, derive }