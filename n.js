/* n - nanoJS
 * Minimal reactive framework, batteries included
 *   - dom manipulation
 *   - reactive state
 *   - router
 *
 * TODO:
 *   - remove dom element when bind returns false (derive also?)
 *   - component
 *
 */

import { watch } from './s.mjs'

const proto = Object.getPrototypeOf
const objProto = proto({})
const funProto = proto(function() {})
const asyncProto = proto(async function() {})

const isObj = _ => proto(_ ?? 0) === objProto
const isFun = _ => [funProto, asyncProto].includes(proto(_ ?? 0))
const isNode = _ => !!(_?.nodeType ?? 0)
const isState = _ => !!(_?.__isState ?? false)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getDom = (elt) =>
    isNode(elt)
        ? elt
        : isFun(elt)
            ? getDom(elt())
            : new Text(elt)

function add(dom, ...children)  {

    function createNode(elt) {
        if (elt === null) return null
        if (isNode(elt)) return elt
        return document.createTextNode(elt)
    }

    for (let child of children.flat(Infinity)) {
        if (isState(child)) {
            let node = createNode(child.value)
            watch(() => {
                const newNode = createNode(child.value)
                newNode === null ? node.remove() : node.replaceWith(newNode)
                node = newNode
            })
            dom.appendChild(node)
        } else
        if (isFun(child)) {
            let node = createNode(child())
            watch(() => {
                const newNode = createNode(child())
                newNode === null ? node.remove() : node.replaceWith(newNode)
                node = newNode
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
            return (...args) => {
                const [props, ...children] = (isObj(args[0]) && !isState(args[0])) ? args : [{}, ...args]
                const elt = document.createElement(tag)
                for (let [prop, value] of Object.entries(props)) {
                    if (isFun(value) && prop.startsWith('on')) {
                        elt.addEventListener(prop.slice(2).toLowerCase(), value)
                    } else
                    if (isFun(value)) {
                        watch(() => {
                            elt.setAttribute(prop, value())
                        })
                    } else
                    if (isState(value)) {
                        watch(() => {
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

const router = (routes, root, notfound) => {
    notfound ??= _ => '404: not found'
    const parts = hash => hash.match(/[^:/]+/g)
    const navigate = (hash) => {
        const hparts = parts(hash)
        const [ route, component ] = routes.find(([h]) => parts(h)[0] === hparts?.[0]) ?? [ '#notfound', notfound ]
        const rparts = parts(route)
        const args = Object.fromEntries(rparts.slice(1).map((v, i) => [v, hparts[i + 1]]))
        const parent = root ?? document.body
        parent.replaceChildren(component(args))
    }
    window.addEventListener('hashchange', e => {
        navigate(window.location.hash)
    })
    navigate(window.location.hash || routes[0][0])
}

export { tags, add, router, sleep }