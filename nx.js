function tag(target, tag) {
    return (attrs = {}, content = '') => {
        let attributes = ' '
        for (let attr in attrs) {
            attributes += ` ${attr}="${attrs[attr]}"`
        }
        return `<${tag}${attributes}>${content}</${tag}>`
    }
}

const tags = new Proxy(()=>{}, {
    apply(target, self, args) {
        console.log(target, self, args)
        return new Proxy()
    },
    get(target, tag) {
        return (attrs = {}, content = '') => {
            let attributes = ' '
            for (let attr in attrs) {
                attributes += ` ${attr}="${attrs[attr]}"`
            }
            return `<${tag}${attributes}>${content}</${tag}>`
        }
    }
})

const { div, button } = tags
const { svg, path } = tags("http://www.w3.org/2000/svg")