// Hash router: router

function router(routes, root, notfound) {
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

export { router }
